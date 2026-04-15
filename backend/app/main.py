"""NEXUS Backend — FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, conversations, documents, workflows, agents, mcp

settings = get_settings()

app = FastAPI(
    title="NEXUS API",
    description="Backend API for the NEXUS intelligent automation platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflows"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(mcp.router, prefix="/api/mcp", tags=["MCP"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "nexus-api", "version": "0.1.0"}
