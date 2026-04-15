Vous êtes mon équipe projet (Nassim Tarkhani, Med Aziz Mzeh, Achraf Ltaief) et je veux que vous compreniez parfaitement NEXUS pour pouvoir le présenter, le développer et le défendre.

Contexte
- Projet : NEXUS — Plateforme SaaS d’automatisation intelligente
- Objectif : livrer un MVP en ~3 mois (6 sprints de 2 semaines) en suivant Scrum + CI/CD.
- Problème à résoudre : les entreprises ont des processus manuels, des outils fragmentés, et des connaissances dispersées ; l’IA est difficile à intégrer correctement.
- Vision : unifier automatisation + IA + connaissance d’entreprise dans une plateforme unique, sécurisée et multi-tenant.

Pitch (à mémoriser en 20 secondes)
“NEXUS est une plateforme SaaS qui permet de créer des workflows visuels (comme n8n), d’y intégrer des agents IA multi-rôles, et d’interroger les documents internes via un chat RAG avec citations, tout en restant sécurisé, multi-tenant et interopérable via MCP.”

Piliers du produit (ce qu’on construit)
1) Workflows visuels
- Éditeur drag-and-drop (React Flow), nœuds, connexions, validation.
- Triggers : Webhook et Cron (MVP).
- Exécution : moteur DAG avec logs par nœud.

2) Agents IA (multi-agents)
- Agents configurables (rôle, prompt, modèle).
- Orchestration en chaîne planner → executor → reviewer.
- Multi-LLM : OpenAI, Anthropic, AWS Bedrock.
- Intégration : un agent peut être un nœud dans un workflow.

3) Chat RAG entreprise
- Ingestion documents (PDF, DOCX, CSV, TXT, MD).
- Chunking + embeddings + indexation (pgvector).
- Recherche hybride vector + BM25 (OpenSearch), réponses avec citations.
- Respect des droits (tenant/collections).

4) MCP (interopérabilité)
- Serveur MCP exposant tools/resources aux agents :
  - execute_workflow
  - search_knowledge_base
  - (optionnel) query_database readonly
- Auth + scopes par tenant.

Contraintes / Exigences clés
- Multi-tenant strict : aucune fuite cross-tenant (scoping/RLS).
- Sécurité : TLS 1.3, AES-256, JWT/OAuth2, audit logs.
- Performance cible : API p95 < 200ms (hors IA) ; RAG < 2s via streaming.
- Qualité : CI obligatoire, PR review, tests (objectif >80% services critiques).

Stack technique retenue
- Frontend : Next.js + TypeScript + Tailwind + shadcn/ui + React Flow
- Backend : FastAPI (Python) + Pydantic + SQLAlchemy + Alembic
- Async : Celery + Redis
- Data : Supabase PostgreSQL + pgvector, OpenSearch (BM25), Redis
- Infra : AWS ECS Fargate + RDS + S3 + CloudWatch + Secrets Manager + CDK

Méthodologie de travail (comment on travaille)
- Scrum 2 semaines : Planning, Daily, Review, Retro + Refinement mi-sprint.
- Trunk-based dev : petites branches, PR courtes, merge fréquent.
- CI/CD : lint + tests + build sur chaque PR, staging si possible.
- Spikes IA timeboxés : valider RAG/chunking, qualité retrieval, MCP tools.
- Board GitHub Projects : colonnes Backlog → Ready → In Progress → Review → Done (+ Expedite pour urgences).

Répartition des rôles (opérationnelle)
- PO : Mahmoud Belayeb — vision, priorisation, validation
- SM : Nassim Tarkhani — cérémonies, blocages, suivi
- Backend : Med Aziz Mzeh — Auth, RBAC, engine, APIs
- Frontend : Achraf Ltaief — builder UI, dashboard, chat UI
(PO/SM peuvent aider au dev selon besoin)

Planning 3 mois (releases)
- Sprint 1 : foundations (infra + auth + multi-tenant)
- Sprint 2 : workflows v1 (builder + engine + triggers + logs) �� Release 0.1 Alpha
- Sprint 3 : agents IA (core + multi-agents)
- Sprint 4 : RAG + MCP (tools essentiels) → Release 0.2 Beta
- Sprint 5 : templates + intégration + dashboard
- Sprint 6 : sécurité, tests E2E, monitoring, docs → Release 1.0 MVP

Ce que j’attends de vous (actions immédiates)
1) Chacun confirme sa compréhension en 5 bullets : “ce que NEXUS fait” + “ce qu’on livre au MVP”.
2) Chacun liste 5 risques techniques/pratiques + une solution (mitigation).
3) Proposer 3 user stories à prendre en priorité dans Sprint 1 selon votre rôle.

Questions à répondre (pour s’aligner)
- Quel est notre “workflow démo” de référence pour le MVP ? (ex : webhook → agent IA → email)
- Quel est notre set minimal de nœuds (MVP) et notre modèle de données workflow ?
- Quelle stratégie chunking/embeddings pour la qualité RAG ?
- Quel format standard d’output entre nœuds (JSON schema) ?
- Quels critères de DoD par sprint ?

Répondez dans ce format :
- Compréhension (5 bullets)
- Risques (5 items)
- Priorités Sprint 1 (3 user stories)
- Questions / blocages