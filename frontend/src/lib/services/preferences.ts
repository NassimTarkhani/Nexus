// User Preferences Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

export const preferencesService = {
    // Get user preferences
    async getPreferences(userId: string) {
        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If preferences don't exist, create default ones
            if (error.code === 'PGRST116') {
                return this.createDefaultPreferences(userId);
            }
            throw error;
        }
        return data;
    },

    // Create default preferences
    async createDefaultPreferences(userId: string) {
        const { data, error } = await supabase
            .from('user_preferences')
            .insert({
                user_id: userId,
                theme: 'dark',
                language: 'en',
                chat_temperature: 0.7,
                tool_mode: 'auto',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update preferences
    async updatePreferences(userId: string, updates: UserPreferencesUpdate) {
        const { data, error } = await supabase
            .from('user_preferences')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update theme
    async updateTheme(userId: string, theme: 'dark' | 'light') {
        return this.updatePreferences(userId, { theme });
    },

    // Update language
    async updateLanguage(userId: string, language: string) {
        return this.updatePreferences(userId, { language });
    },

    // Update chat temperature
    async updateTemperature(userId: string, temperature: number) {
        return this.updatePreferences(userId, { chat_temperature: temperature });
    },

    // Update tool mode
    async updateToolMode(userId: string, toolMode: 'auto' | 'manual') {
        return this.updatePreferences(userId, { tool_mode: toolMode });
    },
};
