"""MCP router — Model Context Protocol server endpoints.

Exposes tools/resources that external MCP clients (Claude, Cursor, etc.)
can discover and invoke.  MVP tools:
  - execute_workflow
  - search_knowledge_base
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.supabase_client import get_supabase
from app.middleware.auth import get_current_user, AuthUser

router = APIRouter()


# ── MCP server discovery ──────────────────────────────────────────────────


class MCPToolDefinition(BaseModel):
    name: str
    description: str
    input_schema: dict


@router.get("/tools", response_model=list[MCPToolDefinition])
async def list_mcp_tools(user: AuthUser = Depends(get_current_user)):
    """Return the list of tools this MCP server exposes."""
    return [
        MCPToolDefinition(
            name="execute_workflow",
            description="Execute a NEXUS workflow by ID with optional input data.",
            input_schema={
                "type": "object",
                "properties": {
                    "workflow_id": {"type": "string", "description": "ID of the workflow to execute"},
                    "input_data": {"type": "object", "description": "Input data for the workflow"},
                },
                "required": ["workflow_id"],
            },
        ),
        MCPToolDefinition(
            name="search_knowledge_base",
            description="Search the NEXUS knowledge base for relevant document chunks.",
            input_schema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "document_id": {"type": "string", "description": "Optional document ID to scope search"},
                    "limit": {"type": "integer", "description": "Max results (default 5)"},
                },
                "required": ["query"],
            },
        ),
    ]


# ── MCP tool invocations ─────────────────────────────────────────────────


class MCPToolCall(BaseModel):
    name: str
    arguments: dict


class MCPToolResult(BaseModel):
    content: str
    is_error: bool = False


@router.post("/tools/call", response_model=MCPToolResult)
async def call_mcp_tool(
    body: MCPToolCall,
    user: AuthUser = Depends(get_current_user),
):
    """Invoke an MCP tool."""
    if body.name == "search_knowledge_base":
        return await _search_kb(user, body.arguments)
    elif body.name == "execute_workflow":
        return MCPToolResult(
            content="Workflow execution engine coming in Sprint 2.",
            is_error=False,
        )
    else:
        raise HTTPException(status_code=404, detail=f"Unknown tool: {body.name}")


async def _search_kb(user: AuthUser, args: dict) -> MCPToolResult:
    query = args.get("query", "")
    document_id = args.get("document_id")
    limit = min(args.get("limit", 5), 20)

    if not query:
        return MCPToolResult(content="Query is required", is_error=True)

    sb = get_supabase()

    if document_id:
        # Verify ownership
        try:
            await sb.select("documents", columns="id", filters={"id": document_id, "user_id": user.id}, single=True)
        except Exception:
            return MCPToolResult(content="Document not found", is_error=True)

        result = await sb.ilike_search(
            "document_chunks", "content", query,
            columns="content,chunk_index,document_id",
            filters={"document_id": document_id}, limit=limit,
        )
    else:
        # Scope to user's documents
        user_docs = await sb.select("documents", columns="id", filters={"user_id": user.id})
        doc_ids = [d["id"] for d in (user_docs or [])]
        if not doc_ids:
            return MCPToolResult(content="No documents in knowledge base", is_error=False)

        result = await sb.in_filter(
            "document_chunks", "document_id", doc_ids,
            columns="content,chunk_index,document_id", limit=limit,
        )
        # Further filter by query text client-side (in_filter doesn't combine with ilike)
        query_lower = query.lower()
        result = [r for r in result if query_lower in r.get("content", "").lower()]

    if not result:
        return MCPToolResult(content=f"No results found for: {query}", is_error=False)

    chunks = [f"[Chunk {c['chunk_index']}] {c['content'][:500]}" for c in result]
    return MCPToolResult(content="\n\n---\n\n".join(chunks))


# ── MCP server management ────────────────────────────────────────────────

class MCPServerCreate(BaseModel):
    name: str
    url: str
    description: str = ""


class MCPServerResponse(BaseModel):
    id: str
    user_id: str
    name: str
    url: str
    description: str
    status: str
    created_at: str
    updated_at: str


@router.get("/servers", response_model=list[MCPServerResponse])
async def list_mcp_servers(user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    result = await sb.select("user_mcp_servers", filters={"user_id": user.id})
    return result or []


@router.post("/servers", response_model=MCPServerResponse, status_code=201)
async def create_mcp_server(body: MCPServerCreate, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    rows = await sb.insert("user_mcp_servers", {
        "user_id": user.id,
        "name": body.name,
        "url": body.url,
        "description": body.description,
        "status": "connected",
    })
    if not rows:
        raise HTTPException(status_code=500, detail="Failed to register MCP server")
    return rows[0]


@router.delete("/servers/{server_id}", status_code=204)
async def delete_mcp_server(server_id: str, user: AuthUser = Depends(get_current_user)):
    sb = get_supabase()
    await sb.delete("user_mcp_servers", {"id": server_id, "user_id": user.id})
