"""Agents router — CRUD for AI agent configurations."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.supabase_client import get_supabase
from app.middleware.auth import get_current_user, AuthUser

router = APIRouter()


class AgentCreate(BaseModel):
    name: str
    description: str = ""
    system_prompt: str = ""
    provider: str = "openrouter"
    model: str = ""
    tools: list[str] = []
    temperature: float = 0.7


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    system_prompt: str | None = None
    provider: str | None = None
    model: str | None = None
    tools: list[str] | None = None
    temperature: float | None = None


class AgentResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    system_prompt: str
    provider: str
    model: str
    tools: list[str]
    temperature: float
    created_at: str
    updated_at: str


@router.get("/", response_model=list[AgentResponse])
async def list_agents(user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    result = await sb.select("user_agents", filters={"user_id": user.id}, order="-updated_at")
    return result or []


@router.post("/", response_model=AgentResponse, status_code=201)
async def create_agent(body: AgentCreate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    rows = await sb.insert("user_agents", {
        "user_id": user.id,
        "name": body.name,
        "description": body.description,
        "system_prompt": body.system_prompt,
        "provider": body.provider,
        "model": body.model,
        "tools": body.tools,
        "temperature": body.temperature,
    })
    if not rows:
        raise HTTPException(status_code=500, detail="Failed to create agent")
    return rows[0]


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    try:
        result = await sb.select("user_agents", filters={"id": agent_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Agent not found")
    if not result:
        raise HTTPException(status_code=404, detail="Agent not found")
    return result


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: str, body: AgentUpdate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    rows = await sb.update("user_agents", updates, {"id": agent_id, "user_id": user.id})
    if not rows:
        raise HTTPException(status_code=404, detail="Agent not found")
    return rows[0]


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(agent_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    await sb.delete("user_agents", {"id": agent_id, "user_id": user.id})
