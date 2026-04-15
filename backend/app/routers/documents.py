"""Documents router — upload, list, delete, chat."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse

from app.config import get_settings
from app.supabase_client import get_supabase
from app.middleware.auth import get_current_user, AuthUser
from app.schemas.document import (
    DocumentResponse,
    DocumentChatRequest,
)
from app.services.rag import extract_text, chunk_text, build_rag_context, generate_rag_response

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.get("/", response_model=list[DocumentResponse])
async def list_documents(user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    result = await sb.select("documents", filters={"user_id": user.id}, order="-created_at")
    return result or []


@router.post("/upload", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    user: AuthUser = Depends(get_current_user),
):
    """Upload a document, extract text, chunk, and store."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large (max {MAX_FILE_SIZE // (1024*1024)}MB)")

    content_type = file.content_type or "application/octet-stream"

    # Extract text
    try:
        extracted = extract_text(contents, content_type, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not extracted.strip():
        raise HTTPException(status_code=422, detail="No text could be extracted")

    sb = get_supabase()

    # Create document record
    doc_rows = await sb.insert("documents", {
        "user_id": user.id,
        "name": file.filename,
        "file_type": content_type,
        "file_size": len(contents),
        "content": extracted,
        "status": "processing",
    })
    if not doc_rows:
        raise HTTPException(status_code=500, detail="Failed to create document record")

    doc = doc_rows[0]

    # Chunk and store
    chunks = chunk_text(extracted)
    if chunks:
        chunk_rows = [
            {
                "document_id": doc["id"],
                "content": c,
                "chunk_index": i,
                "token_count": len(c) // 4,
                "metadata": {"source": file.filename},
            }
            for i, c in enumerate(chunks)
        ]
        try:
            await sb.insert("document_chunks", chunk_rows)
        except Exception:
            await sb.update("documents", {"status": "error", "error_message": "Chunk insertion failed"}, {"id": doc["id"]})
            raise HTTPException(status_code=500, detail="Failed to store chunks")

    # Mark ready
    await sb.update("documents", {"status": "ready", "chunk_count": len(chunks)}, {"id": doc["id"]})

    updated = await sb.select("documents", filters={"id": doc["id"]}, single=True)
    return {"document": updated, "chunks": len(chunks)}


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    try:
        result = await sb.select("documents", filters={"id": document_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")
    if not result:
        raise HTTPException(status_code=404, detail="Document not found")
    return result


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    await sb.delete("documents", {"id": document_id, "user_id": user.id})


@router.post("/chat")
async def chat_with_document(
    body: DocumentChatRequest,
    user: AuthUser = Depends(get_current_user),
):
    """RAG chat — retrieve context from document chunks and generate a response."""
    sb = get_supabase()

    # Verify ownership
    try:
        doc = await sb.select(
            "documents", columns="id,name,file_type,content",
            filters={"id": body.document_id, "user_id": user.id}, single=True,
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Get chunks
    chunks = await sb.select(
        "document_chunks", columns="content,chunk_index",
        filters={"document_id": body.document_id}, order="chunk_index",
    )

    # Build context
    latest_query = ""
    for m in reversed(body.messages):
        if m.get("role") == "user":
            latest_query = m.get("content", "")
            break

    context = build_rag_context(chunks or [], latest_query)

    # Generate response
    settings = get_settings()
    answer = await generate_rag_response(
        context=context,
        doc_name=doc["name"],
        doc_type=doc["file_type"],
        messages=body.messages,
        model=body.model or settings.default_model,
        api_key=settings.openrouter_api_key,
    )

    # Return as SSE
    async def event_stream():
        yield f"data: {{\"content\": {repr(answer)}, \"done\": false}}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
