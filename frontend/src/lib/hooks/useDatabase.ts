// React hooks for database operations
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store';
import {
    userService,
    preferencesService,
    apiKeysService,
    agentsService,
    workflowsService,
    mcpServersService,
    conversationsService,
    messagesService,
} from '../services';

// Hook for user preferences
export function usePreferences() {
    const { user } = useAuthStore();
    const [preferences, setPreferences] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPreferences = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await preferencesService.getPreferences(user.id);
            setPreferences(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const updateTheme = async (theme: 'dark' | 'light') => {
        if (!user) return;
        try {
            const updated = await preferencesService.updateTheme(user.id, theme);
            setPreferences(updated);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateLanguage = async (language: string) => {
        if (!user) return;
        try {
            const updated = await preferencesService.updateLanguage(user.id, language);
            setPreferences(updated);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateTemperature = async (temperature: number) => {
        if (!user) return;
        try {
            const updated = await preferencesService.updateTemperature(user.id, temperature);
            setPreferences(updated);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateToolMode = async (toolMode: 'auto' | 'manual') => {
        if (!user) return;
        try {
            const updated = await preferencesService.updateToolMode(user.id, toolMode);
            setPreferences(updated);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return {
        preferences,
        loading,
        error,
        refresh: fetchPreferences,
        updateTheme,
        updateLanguage,
        updateTemperature,
        updateToolMode,
    };
}

// Hook for API keys
export function useApiKeys() {
    const { user } = useAuthStore();
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApiKeys = useCallback(async () => {
        if (!user) {
            setApiKeys([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await apiKeysService.getApiKeys(user.id);
            setApiKeys(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchApiKeys();
    }, [fetchApiKeys]);

    const upsertApiKey = async (provider: string, apiKey: string, baseUrl?: string) => {
        if (!user) return;
        try {
            const saved = await apiKeysService.upsertApiKey({
                user_id: user.id,
                provider,
                api_key: apiKey,
                base_url: baseUrl || null,
                enabled: true,
            });

            // Optimistic local update to avoid blocking UI on a second roundtrip
            setApiKeys((prev) => {
                const withoutProvider = prev.filter((k) => k.provider !== provider);
                return [saved, ...withoutProvider];
            });

            // Refresh in background for consistency
            fetchApiKeys();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteApiKey = async (id: string) => {
        try {
            await apiKeysService.deleteApiKey(id);
            await fetchApiKeys();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const toggleApiKey = async (id: string, enabled: boolean) => {
        try {
            await apiKeysService.toggleApiKey(id, enabled);
            await fetchApiKeys();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        apiKeys,
        loading,
        error,
        refresh: fetchApiKeys,
        upsertApiKey,
        deleteApiKey,
        toggleApiKey,
    };
}

// Hook for agents
export function useAgents() {
    const { user } = useAuthStore();
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgents = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await agentsService.getAgents(user.id);
            setAgents(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const createAgent = async (agent: any) => {
        if (!user) return;
        try {
            const created = await agentsService.createAgent({
                ...agent,
                user_id: user.id,
            });
            await fetchAgents();
            return created;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateAgent = async (id: string, updates: any) => {
        try {
            await agentsService.updateAgent(id, updates);
            await fetchAgents();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteAgent = async (id: string) => {
        try {
            await agentsService.deleteAgent(id);
            await fetchAgents();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        agents,
        loading,
        error,
        refresh: fetchAgents,
        createAgent,
        updateAgent,
        deleteAgent,
    };
}

// Hook for workflows
export function useWorkflows() {
    const { user } = useAuthStore();
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkflows = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await workflowsService.getWorkflows(user.id);
            setWorkflows(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    const createWorkflow = async (workflow: any) => {
        if (!user) return;
        try {
            const created = await workflowsService.createWorkflow({
                ...workflow,
                user_id: user.id,
            });
            await fetchWorkflows();
            return created;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateWorkflow = async (id: string, updates: any) => {
        try {
            await workflowsService.updateWorkflow(id, updates);
            await fetchWorkflows();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteWorkflow = async (id: string) => {
        try {
            await workflowsService.deleteWorkflow(id);
            await fetchWorkflows();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const togglePublished = async (id: string, isPublished: boolean) => {
        try {
            await workflowsService.togglePublished(id, isPublished);
            await fetchWorkflows();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        workflows,
        loading,
        error,
        refresh: fetchWorkflows,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        togglePublished,
    };
}

// Hook for MCP servers
export function useMcpServers() {
    const { user } = useAuthStore();
    const [mcpServers, setMcpServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMcpServers = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await mcpServersService.getMcpServers(user.id);
            setMcpServers(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMcpServers();
    }, [fetchMcpServers]);

    const createMcpServer = async (server: any) => {
        if (!user) return;
        try {
            const created = await mcpServersService.createMcpServer({
                ...server,
                user_id: user.id,
            });
            await fetchMcpServers();
            return created;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateMcpServer = async (id: string, updates: any) => {
        try {
            await mcpServersService.updateMcpServer(id, updates);
            await fetchMcpServers();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteMcpServer = async (id: string) => {
        try {
            await mcpServersService.deleteMcpServer(id);
            await fetchMcpServers();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateConnectionStatus = async (id: string, status: 'connected' | 'disconnected' | 'error') => {
        try {
            await mcpServersService.updateConnectionStatus(id, status);
            await fetchMcpServers();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        mcpServers,
        loading,
        error,
        refresh: fetchMcpServers,
        createMcpServer,
        updateMcpServer,
        deleteMcpServer,
        updateConnectionStatus,
    };
}

// Hook for conversations
export function useConversations() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await conversationsService.getConversations(user.id);
            setConversations(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const createConversation = async (title: string) => {
        if (!user) return;
        try {
            const created = await conversationsService.createConversation({
                user_id: user.id,
                title,
            });
            await fetchConversations();
            return created;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateTitle = async (id: string, title: string) => {
        try {
            await conversationsService.updateTitle(id, title);
            await fetchConversations();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteConversation = async (id: string) => {
        try {
            await conversationsService.deleteConversation(id);
            await fetchConversations();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        conversations,
        loading,
        error,
        refresh: fetchConversations,
        createConversation,
        updateTitle,
        deleteConversation,
    };
}

// Hook for messages in a specific conversation
export function useMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) {
            setMessages([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await messagesService.getMessages(conversationId);
            setMessages(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const createMessage = async (role: 'user' | 'assistant' | 'system', content: string, provider?: string, model?: string) => {
        if (!conversationId) return;
        try {
            const created = await messagesService.createMessage({
                conversation_id: conversationId,
                role,
                content,
                provider: provider || null,
                model: model || null,
            });
            await fetchMessages();
            return created;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateMessage = async (id: string, content: string) => {
        try {
            await messagesService.updateMessage(id, { content });
            await fetchMessages();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            await messagesService.deleteMessage(id);
            await fetchMessages();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        messages,
        loading,
        error,
        refresh: fetchMessages,
        createMessage,
        updateMessage,
        deleteMessage,
    };
}
