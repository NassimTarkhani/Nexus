"""Workflows router — CRUD + execution."""

from fastapi import APIRouter, Depends, HTTPException

from app.supabase_client import get_supabase
from app.middleware.auth import get_current_user, AuthUser
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowUpdate,
    WorkflowResponse,
    WorkflowExecutionRequest,
    WorkflowExecutionResponse,
)

router = APIRouter()


@router.get("/", response_model=list[WorkflowResponse])
async def list_workflows(user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    result = await sb.select("user_workflows", filters={"user_id": user.id}, order="-updated_at")
    return result or []


@router.post("/", response_model=WorkflowResponse, status_code=201)
async def create_workflow(body: WorkflowCreate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    rows = await sb.insert("user_workflows", {
        "user_id": user.id,
        "name": body.name,
        "description": body.description,
        "workflow_data": body.workflow_data,
    })
    if not rows:
        raise HTTPException(status_code=500, detail="Failed to create workflow")
    return rows[0]


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    try:
        result = await sb.select("user_workflows", filters={"id": workflow_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if not result:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return result


@router.patch("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(workflow_id: str, body: WorkflowUpdate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    rows = await sb.update("user_workflows", updates, {"id": workflow_id, "user_id": user.id})
    if not rows:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return rows[0]


@router.delete("/{workflow_id}", status_code=204)
async def delete_workflow(workflow_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    await sb.delete("user_workflows", {"id": workflow_id, "user_id": user.id})


@router.post("/{workflow_id}/execute", response_model=WorkflowExecutionResponse)
async def execute_workflow(workflow_id: str, body: WorkflowExecutionRequest, user: AuthUser = Depends(get_current_user)):
    """Execute a workflow (MVP: placeholder). Full DAG engine in Sprint 2."""
    sb = get_supabase()
    try:
        wf = await sb.select("user_workflows", filters={"id": workflow_id, "user_id": user.id}, single=True)
    except Exception:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    return WorkflowExecutionResponse(
        execution_id=f"exec-{workflow_id[:8]}",
        status="pending",
        result={"message": "Workflow execution engine coming in Sprint 2"},
    )
