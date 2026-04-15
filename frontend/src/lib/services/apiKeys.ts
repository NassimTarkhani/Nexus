// API Keys Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type UserApiKey = Database['public']['Tables']['user_api_keys']['Row'];
type UserApiKeyInsert = Database['public']['Tables']['user_api_keys']['Insert'];
type UserApiKeyUpdate = Database['public']['Tables']['user_api_keys']['Update'];

export const apiKeysService = {
    // Get all API keys for user
    async getApiKeys(userId: string) {
        const { data, error } = await supabase
            .from('user_api_keys')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get API key by provider
    async getApiKeyByProvider(userId: string, provider: string) {
        const { data, error } = await supabase
            .from('user_api_keys')
            .select('*')
            .eq('user_id', userId)
            .eq('provider', provider)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Add or update API key
    async upsertApiKey(apiKey: Omit<UserApiKeyInsert, 'id'>) {
        const { data, error } = await supabase
            .from('user_api_keys')
            .upsert(apiKey, {
                onConflict: 'user_id,provider',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update API key
    async updateApiKey(id: string, updates: UserApiKeyUpdate) {
        const { data, error } = await supabase
            .from('user_api_keys')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Toggle API key enabled status
    async toggleApiKey(id: string, enabled: boolean) {
        return this.updateApiKey(id, { enabled });
    },

    // Delete API key
    async deleteApiKey(id: string) {
        const { error } = await supabase
            .from('user_api_keys')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get enabled API keys
    async getEnabledApiKeys(userId: string) {
        const { data, error } = await supabase
            .from('user_api_keys')
            .select('*')
            .eq('user_id', userId)
            .eq('enabled', true);

        if (error) throw error;
        return data || [];
    },
};
