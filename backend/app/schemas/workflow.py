"""Workflow schemas."""

from pydantic import BaseModel
from datetime import datetime
from typing import Any


class WorkflowCreate(BaseModel):
    name: str
    description: str = ""
    workflow_data: dict[str, Any] = {}


class WorkflowUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    workflow_data: dict[str, Any] | None = None
    is_published: bool | None = None


class WorkflowResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    workflow_data: dict[str, Any]
    is_published: bool
    created_at: datetime
    updated_at: datetime


class WorkflowExecutionRequest(BaseModel):
    input_data: dict[str, Any] = {}


class WorkflowExecutionResponse(BaseModel):
    execution_id: str
    status: str
    result: dict[str, Any] | None = None
