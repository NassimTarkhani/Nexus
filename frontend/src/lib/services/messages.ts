// Messages Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export const messagesService = {
    // Get all messages for a conversation
    async getMessages(conversationId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Get message by ID
    async getMessageById(id: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create message
    async createMessage(message: Omit<MessageInsert, 'id'>) {
        const { data, error } = await supabase
            .from('messages')
            .insert(message)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update message
    async updateMessage(id: string, updates: MessageUpdate) {
        const { data, error } = await supabase
            .from('messages')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete message
    async deleteMessage(id: string) {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get messages by role
    async getMessagesByRole(conversationId: string, role: 'user' | 'assistant' | 'system') {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .eq('role', role)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Search messages
    async searchMessages(conversationId: string, query: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .ilike('content', `%${query}%`)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Get last message in conversation
    async getLastMessage(conversationId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    // Count messages in conversation
    async countMessages(conversationId: string) {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversationId);

        if (error) throw error;
        return count || 0;
    },
};
