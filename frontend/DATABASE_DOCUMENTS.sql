-- ============================================================
-- NEXUS — Documents & RAG tables
-- Run this in Supabase SQL Editor AFTER DATABASE_SCHEMA.sql
-- ============================================================

-- Documents table — stores uploaded file metadata + extracted text
CREATE TABLE IF NOT EXISTS documents (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    file_type   TEXT NOT NULL,
    file_size   BIGINT NOT NULL DEFAULT 0,
    content     TEXT,                              -- full extracted text
    chunk_count INTEGER DEFAULT 0,
    status      TEXT NOT NULL DEFAULT 'processing'
                CHECK (status IN ('uploading', 'processing', 'ready', 'error')),
    error_message TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents"
    ON documents FOR ALL
    USING (auth.uid() = user_id);

-- Document chunks — for RAG retrieval
CREATE TABLE IF NOT EXISTS document_chunks (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id    UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content        TEXT NOT NULL,
    chunk_index    INTEGER NOT NULL,
    token_count    INTEGER DEFAULT 0,
    metadata       JSONB DEFAULT '{}',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own document chunks"
    ON document_chunks FOR ALL
    USING (
        document_id IN (SELECT id FROM documents WHERE user_id = auth.uid())
    );

-- Index for fast chunk lookups
CREATE INDEX IF NOT EXISTS idx_document_chunks_doc_id
    ON document_chunks(document_id);

-- Trigger to update documents.updated_at
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_documents_updated_at ON documents;
CREATE TRIGGER trigger_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();
