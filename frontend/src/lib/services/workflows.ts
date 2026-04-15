// Workflows Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type UserWorkflow = Database['public']['Tables']['user_workflows']['Row'];
type UserWorkflowInsert = Database['public']['Tables']['user_workflows']['Insert'];
type UserWorkflowUpdate = Database['public']['Tables']['user_workflows']['Update'];

export const workflowsService = {
    // Get all workflows for user
    async getWorkflows(userId: string) {
        const { data, error } = await supabase
            .from('user_workflows')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get workflow by ID
    async getWorkflowById(id: string) {
        const { data, error } = await supabase
            .from('user_workflows')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create workflow
    async createWorkflow(workflow: Omit<UserWorkflowInsert, 'id'>) {
        const { data, error } = await supabase
            .from('user_workflows')
            .insert(workflow)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update workflow
    async updateWorkflow(id: string, updates: UserWorkflowUpdate) {
        const { data, error } = await supabase
            .from('user_workflows')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete workflow
    async deleteWorkflow(id: string) {
        const { error } = await supabase
            .from('user_workflows')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Toggle workflow published status
    async togglePublished(id: string, isPublished: boolean) {
        return this.updateWorkflow(id, { is_published: isPublished });
    },

    // Get published workflows
    async getPublishedWorkflows(userId: string) {
        const { data, error } = await supabase
            .from('user_workflows')
            .select('*')
            .eq('user_id', userId)
            .eq('is_published', true);

        if (error) throw error;
        return data || [];
    },
};
