// MCP Servers Service
import { supabase } from '../supabase';
import type { Database } from '../supabase';

type UserMcpServer = Database['public']['Tables']['user_mcp_servers']['Row'];
type UserMcpServerInsert = Database['public']['Tables']['user_mcp_servers']['Insert'];
type UserMcpServerUpdate = Database['public']['Tables']['user_mcp_servers']['Update'];

export const mcpServersService = {
    // Get all MCP servers for user
    async getMcpServers(userId: string) {
        const { data, error } = await supabase
            .from('user_mcp_servers')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get MCP server by ID
    async getMcpServerById(id: string) {
        const { data, error } = await supabase
            .from('user_mcp_servers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create MCP server
    async createMcpServer(server: Omit<UserMcpServerInsert, 'id'>) {
        const { data, error } = await supabase
            .from('user_mcp_servers')
            .insert(server)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update MCP server
    async updateMcpServer(id: string, updates: UserMcpServerUpdate) {
        const { data, error } = await supabase
            .from('user_mcp_servers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete MCP server
    async deleteMcpServer(id: string) {
        const { error } = await supabase
            .from('user_mcp_servers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Update connection status
    async updateConnectionStatus(id: string, status: 'connected' | 'disconnected' | 'error') {
        return this.updateMcpServer(id, { status });
    },

    // Get connected MCP servers
    async getConnectedMcpServers(userId: string) {
        const { data, error } = await supabase
            .from('user_mcp_servers')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'connected');

        if (error) throw error;
        return data || [];
    },
};
