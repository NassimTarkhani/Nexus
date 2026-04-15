import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string;
                    role: 'admin' | 'user';
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            user_preferences: {
                Row: {
                    id: string;
                    user_id: string;
                    theme: 'dark' | 'light';
                    language: string;
                    chat_temperature: number;
                    tool_mode: 'auto' | 'manual';
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_preferences']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_preferences']['Insert']>;
            };
            user_api_keys: {
                Row: {
                    id: string;
                    user_id: string;
                    provider: string;
                    api_key: string;
                    base_url: string | null;
                    enabled: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_api_keys']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_api_keys']['Insert']>;
            };
            user_agents: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string;
                    system_prompt: string;
                    provider: string;
                    model: string;
                    tools: string[];
                    temperature: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_agents']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_agents']['Insert']>;
            };
            user_workflows: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string;
                    workflow_data: any;
                    is_published: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_workflows']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_workflows']['Insert']>;
            };
            user_mcp_servers: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    url: string;
                    description: string;
                    status: 'connected' | 'disconnected' | 'error';
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['user_mcp_servers']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['user_mcp_servers']['Insert']>;
            };
            conversations: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    provider: string | null;
                    model: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['messages']['Insert']>;
            };
        };
    };
}
