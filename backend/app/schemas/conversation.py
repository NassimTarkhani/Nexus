"""Conversation & message schemas."""

from pydantic import BaseModel
from datetime import datetime


class ConversationCreate(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str
    provider: str | None = None
    model: str | None = None


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    provider: str | None
    model: str | None
    created_at: datetime
