-- Database Schema Updates for NEXUS Upgrade
-- Run this in Supabase SQL Editor

-- Add columns to conversations table for tracking
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS model_used TEXT,
ADD COLUMN IF NOT EXISTS workflow_id UUID REFERENCES public.user_workflows(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS mcp_tool_id UUID REFERENCES public.user_mcp_servers(id) ON DELETE SET NULL;

-- Add columns to messages table for tracking
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'openrouter',
ADD COLUMN IF NOT EXISTS workflow_id UUID,
ADD COLUMN IF NOT EXISTS mcp_tool_id UUID,
ADD COLUMN IF NOT EXISTS preset_id UUID;

-- Create user_presets table
CREATE TABLE IF NOT EXISTS public.user_presets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER,
    preferred_model TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add theme preferences to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS theme_style TEXT DEFAULT 'dark' CHECK (theme_style IN ('dark', 'light', 'atmospheric'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_model_used ON public.conversations(model_used);
CREATE INDEX IF NOT EXISTS idx_conversations_workflow_id ON public.conversations(workflow_id);
CREATE INDEX IF NOT EXISTS idx_conversations_mcp_tool_id ON public.conversations(mcp_tool_id);
CREATE INDEX IF NOT EXISTS idx_messages_provider ON public.messages(provider);
CREATE INDEX IF NOT EXISTS idx_messages_preset_id ON public.messages(preset_id);
CREATE INDEX IF NOT EXISTS idx_user_presets_user_id ON public.user_presets(user_id);

-- Enable RLS for user_presets
ALTER TABLE public.user_presets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_presets
CREATE POLICY "Users can manage their own presets" 
ON public.user_presets
FOR ALL 
USING (auth.uid() = user_id);

-- Trigger for updated_at on user_presets
CREATE TRIGGER update_user_presets_updated_at 
BEFORE UPDATE ON public.user_presets
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.user_presets TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert default presets for existing users (optional)
INSERT INTO public.user_presets (user_id, name, description, system_prompt)
SELECT 
    id,
    'Default Assistant',
    'A helpful, accurate, and friendly AI assistant',
    'You are a helpful AI assistant. Provide accurate, detailed, and friendly responses to user questions.'
FROM public.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_presets WHERE user_presets.user_id = users.id
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema updated successfully!';
    RAISE NOTICE 'New tables: user_presets';
    RAISE NOTICE 'Updated tables: conversations (model_used, workflow_id, mcp_tool_id)';
    RAISE NOTICE 'Updated tables: messages (provider, workflow_id, mcp_tool_id, preset_id)';
    RAISE NOTICE 'Updated tables: user_preferences (theme_style)';
END $$;
