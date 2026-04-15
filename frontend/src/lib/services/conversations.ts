// Conversations Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
type ConversationUpdate = Database['public']['Tables']['conversations']['Update'];

export const conversationsService = {
    // Get all conversations for user
    async getConversations(userId: string) {
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get conversation by ID
    async getConversationById(id: string) {
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create conversation
    async createConversation(conversation: Omit<ConversationInsert, 'id'>) {
        const { data, error } = await supabase
            .from('conversations')
            .insert(conversation)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update conversation
    async updateConversation(id: string, updates: ConversationUpdate) {
        const { data, error } = await supabase
            .from('conversations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update conversation title
    async updateTitle(id: string, title: string) {
        return this.updateConversation(id, { title });
    },

    // Delete conversation (messages will be deleted via CASCADE)
    async deleteConversation(id: string) {
        const { error } = await supabase
            .from('conversations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Search conversations
    async searchConversations(userId: string, query: string) {
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', userId)
            .ilike('title', `%${query}%`)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },
};
