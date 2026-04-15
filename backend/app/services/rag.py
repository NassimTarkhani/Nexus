"""RAG service — document text extraction, chunking, retrieval, and generation."""

from __future__ import annotations
import io
from openai import AsyncOpenAI

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
MAX_CONTEXT_CHARS = 48_000


# ── Text Extraction ───────────────────────────────────────────────────────


def extract_text(content: bytes, content_type: str, filename: str) -> str:
    """Extract plain text from a file's bytes based on content type."""
    if content_type == "application/pdf":
        return _extract_pdf(content)
    elif content_type.startswith("text/") or filename.endswith((".txt", ".md", ".csv")):
        return content.decode("utf-8", errors="replace")
    else:
        raise ValueError(f"Unsupported file type: {content_type}")


def _extract_pdf(content: bytes) -> str:
    try:
        import pdfplumber
    except ImportError:
        raise RuntimeError("pdfplumber not installed — run: pip install pdfplumber")

    text_parts: list[str] = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n\n".join(text_parts)


# ── Chunking ──────────────────────────────────────────────────────────────


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + size, len(text))
        chunks.append(text[start:end])
        start += size - overlap
        if start >= len(text):
            break
    return chunks


# ── Context Building ──────────────────────────────────────────────────────


def build_rag_context(chunks: list[dict], query: str) -> str:
    """Select the most relevant chunks to form the RAG context window."""
    if not chunks:
        return ""

    # Short documents — include everything
    if len(chunks) <= 20:
        context = "\n\n".join(c["content"] for c in chunks)
    else:
        # Keyword scoring
        query_words = [w.lower() for w in query.split() if len(w) > 3]
        scored = []
        for c in chunks:
            lower = c["content"].lower()
            score = sum(1 for w in query_words if w in lower)
            scored.append((score, c))

        # First 2 chunks for intro context + top 10 by relevance
        selected_indices = set()
        for c in chunks[:2]:
            selected_indices.add(c["chunk_index"])
        for _, c in sorted(scored, key=lambda x: -x[0])[:10]:
            selected_indices.add(c["chunk_index"])

        selected = sorted(
            [c for c in chunks if c["chunk_index"] in selected_indices],
            key=lambda c: c["chunk_index"],
        )
        context = "\n\n".join(c["content"] for c in selected)

    # Truncate
    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS] + "\n\n[... document truncated ...]"

    return context


# ── Generation ────────────────────────────────────────────────────────────


async def generate_rag_response(
    context: str,
    doc_name: str,
    doc_type: str,
    messages: list[dict],
    model: str,
    api_key: str,
) -> str:
    """Call the LLM with document context + user messages."""
    system_prompt = f"""You are a helpful AI assistant analyzing a document.

Document name: "{doc_name}"
Document type: {doc_type}

Below is the content of the document. Answer the user's questions based ONLY on this document content. If the answer is not in the document, say so clearly. Always cite specific parts when possible.

---DOCUMENT CONTENT---
{context}
---END DOCUMENT---"""

    client = AsyncOpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
    )

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            *messages,
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content or ""
