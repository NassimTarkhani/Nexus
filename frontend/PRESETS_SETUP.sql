-- ============================================
-- NEXUS: Presets Table Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Create user_presets table
CREATE TABLE IF NOT EXISTS public.user_presets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL DEFAULT '',
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER,
    preferred_model TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add provider/model columns to messages if they don't exist
ALTER TABLE public.messages
    ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openrouter',
    ADD COLUMN IF NOT EXISTS model TEXT;

-- Enable RLS
ALTER TABLE public.user_presets ENABLE ROW LEVEL SECURITY;

-- Drop policy if it already exists (so re-running is safe)
DROP POLICY IF EXISTS "Users can manage their own presets" ON public.user_presets;

-- RLS: users can only see/edit their own presets
CREATE POLICY "Users can manage their own presets"
ON public.user_presets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on modification
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_user_presets_updated_at ON public.user_presets;
CREATE TRIGGER set_user_presets_updated_at
    BEFORE UPDATE ON public.user_presets
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Grant permissions to authenticated users
GRANT ALL ON public.user_presets TO authenticated;

-- Done
DO $$ BEGIN
    RAISE NOTICE '✅ user_presets table ready!';
    RAISE NOTICE '✅ messages.provider and messages.model columns ensured.';
END $$;
