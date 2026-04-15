// Agents Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type UserAgent = Database['public']['Tables']['user_agents']['Row'];
type UserAgentInsert = Database['public']['Tables']['user_agents']['Insert'];
type UserAgentUpdate = Database['public']['Tables']['user_agents']['Update'];

export const agentsService = {
    // Get all agents for user
    async getAgents(userId: string) {
        const { data, error } = await supabase
            .from('user_agents')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get agent by ID
    async getAgentById(id: string) {
        const { data, error } = await supabase
            .from('user_agents')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create agent
    async createAgent(agent: Omit<UserAgentInsert, 'id'>) {
        const { data, error } = await supabase
            .from('user_agents')
            .insert(agent)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update agent
    async updateAgent(id: string, updates: UserAgentUpdate) {
        const { data, error } = await supabase
            .from('user_agents')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete agent
    async deleteAgent(id: string) {
        const { error } = await supabase
            .from('user_agents')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
