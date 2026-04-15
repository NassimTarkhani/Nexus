"""Auth-related schemas."""

from pydantic import BaseModel, EmailStr


class TokenPayload(BaseModel):
    sub: str
    email: str | None = None
    role: str = "user"


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: str
