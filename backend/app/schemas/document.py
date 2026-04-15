"""Document / RAG schemas."""

from pydantic import BaseModel
from datetime import datetime


class DocumentUploadResponse(BaseModel):
    id: str
    name: str
    file_type: str
    file_size: int
    status: str
    chunk_count: int
    created_at: datetime


class DocumentResponse(BaseModel):
    id: str
    user_id: str
    name: str
    file_type: str
    file_size: int
    content: str | None
    chunk_count: int
    status: str
    error_message: str | None
    created_at: datetime
    updated_at: datetime


class DocumentChatRequest(BaseModel):
    document_id: str
    messages: list[dict]  # [{role, content}]
    model: str | None = None


class DocumentChatChunk(BaseModel):
    content: str
    chunk_index: int


class DocumentSearchRequest(BaseModel):
    query: str
    document_id: str | None = None
    limit: int = 5
