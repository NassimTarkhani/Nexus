# NEXUS Backend

FastAPI backend for the NEXUS intelligent automation platform.

## Stack
- **Framework**: FastAPI + Pydantic  
- **Database**: Supabase PostgreSQL + pgvector  
- **Auth**: Supabase JWT verification  
- **AI**: OpenRouter / OpenAI SDK  
- **Async jobs**: Celery + Redis  

## Quick Start

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
cp .env.example .env         # Fill in environment variables
uvicorn app.main:app --reload --port 8000
```

## Project Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment config (pydantic-settings)
│   ├── database.py          # SQLAlchemy async engine + session
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── conversation.py
│   │   ├── document.py
│   │   └── workflow.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── conversation.py
│   │   ├── document.py
│   │   └── workflow.py
│   ├── routers/             # API endpoints
│   │   ├── auth.py
│   │   ├── conversations.py
│   │   ├── documents.py
│   │   ├── workflows.py
│   │   ├── agents.py
│   │   └── mcp.py
│   ├── services/            # Business logic
│   │   ├── rag.py           # Document ingestion + retrieval
│   │   ├── workflow_engine.py
│   │   └── agent_orchestrator.py
│   └── middleware/
│       └── auth.py          # Supabase JWT verification
├── alembic/                 # DB migrations
├── requirements.txt
└── .env.example
```

## API Docs
Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
