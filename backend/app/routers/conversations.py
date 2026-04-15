"""Conversations router — CRUD + messages."""

from fastapi import APIRouter, Depends, HTTPException

from app.supabase_client import get_supabase
from app.middleware.auth import get_current_user, AuthUser
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
)

router = APIRouter()


@router.get("/", response_model=list[ConversationResponse])
async def list_conversations(user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    result = await sb.select("conversations", filters={"user_id": user.id}, order="-updated_at")
    return result or []


@router.post("/", response_model=ConversationResponse, status_code=201)
async def create_conversation(body: ConversationCreate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    rows = await sb.insert("conversations", {"user_id": user.id, "title": body.title})
    if not rows:
        raise HTTPException(status_code=500, detail="Failed to create conversation")
    return rows[0]


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    try:
        result = await sb.select("conversations", filters={"id": conversation_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return result


@router.delete("/{conversation_id}", status_code=204)
async def delete_conversation(conversation_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    await sb.delete("conversations", {"id": conversation_id, "user_id": user.id})


# ── Messages ──────────────────────────────────────────────────────────────


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
async def list_messages(conversation_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    # Verify ownership
    try:
        await sb.select("conversations", columns="id", filters={"id": conversation_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Conversation not found")

    result = await sb.select("messages", filters={"conversation_id": conversation_id}, order="created_at")
    return result or []


@router.post("/{conversation_id}/messages", response_model=MessageResponse, status_code=201)
async def create_message(conversation_id: str, body: MessageCreate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    try:
        await sb.select("conversations", columns="id", filters={"id": conversation_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Conversation not found")

    rows = await sb.insert("messages", {
        "conversation_id": conversation_id,
        "role": body.role,
        "content": body.content,
        "provider": body.provider,
        "model": body.model,
    })
    if not rows:
        raise HTTPException(status_code=500, detail="Failed to save message")

    # Update conversation timestamp
    await sb.update("conversations", {"updated_at": "now()"}, {"id": conversation_id})

    return rows[0]

    return result.data[0]
