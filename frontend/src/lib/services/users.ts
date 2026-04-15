// User Management Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const userService = {
    // Get current user profile
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data;
    },

    // Get all users (admin only)
    async getAllUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get user by ID
    async getUserById(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    // Update user profile
    async updateUser(userId: string, updates: UserUpdate) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete user (admin only)
    async deleteUser(userId: string) {
        // Delete from auth (cascades to public.users)
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
    },

    // Check if user is admin
    async isAdmin(userId: string) {
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        return data?.role === 'admin';
    },
};
