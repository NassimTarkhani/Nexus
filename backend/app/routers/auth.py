"""Auth router — user profile & session management."""

from fastapi import APIRouter, Depends, HTTPException

from app.supabase_client import get_supabase
from app.middleware.auth import get_current_user, AuthUser
from app.schemas.auth import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_profile(user: AuthUser = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    sb = get_supabase()
    try:
        result = await sb.select("users", filters={"id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="User profile not found")

    if not result:
        raise HTTPException(status_code=404, detail="User profile not found")

    return result
