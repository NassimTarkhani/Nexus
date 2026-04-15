"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { EnhancedChatInput } from "./EnhancedChatInput";
import { EnhancedMessageList, type Message } from "./EnhancedMessageList";
import { PresetSelector } from "./PresetSelector";
import { ModelSelector } from "./ModelSelector";
import { ToolsDropdown, type Tool } from "./ToolsDropdown";
import { DEFAULT_MODEL, type ChatModel } from "@/src/lib/models/openrouter";
import { useAuthStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";
import { conversationsService } from "@/src/lib/services/conversations";
import { messagesService } from "@/src/lib/services/messages";
import { getPreset } from "@/src/lib/services/presets";
import { toast } from "sonner";

interface EnhancedChatWindowProps {
    // Optionally load an existing conversation
    loadConversationId?: string | null;
    onConversationCreated?: (id: string, title: string) => void;
}

export function EnhancedChatWindow({ loadConversationId, onConversationCreated }: EnhancedChatWindowProps = {}) {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();
    const [selectedModel, setSelectedModel] = useState<ChatModel>(DEFAULT_MODEL);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    // Use useRef (not useState) so mutations don't trigger re-renders
    const abortControllerRef = useRef<AbortController | null>(null);
    const selectedModelRef = useRef<ChatModel>(DEFAULT_MODEL);

    const handleModelChange = useCallback((model: ChatModel) => {
        selectedModelRef.current = model;
        setSelectedModel(model);
    }, []);

    // Load an existing conversation when loadConversationId changes
    useEffect(() => {
        if (!loadConversationId || loadConversationId === conversationId) return;
        const load = async () => {
            try {
                const msgs = await messagesService.getMessages(loadConversationId);
                const mapped: Message[] = msgs.map((m) => ({
                    id: m.id,
                    role: m.role as "user" | "assistant",
                    content: m.content,
                    timestamp: new Date(m.created_at),
                    model: m.model || undefined,
                }));
                setMessages(mapped);
                setConversationId(loadConversationId);
            } catch (err) {
                console.error("Failed to load conversation:", err);
                toast.error("Could not load conversation history");
            }
        };
        load();
    }, [loadConversationId]);

    useEffect(() => {
        if (!selectedPreset) return;

        const applyPresetModel = async () => {
            try {
                const preset = await getPreset(selectedPreset);
                if (preset?.preferred_model) {
                    handleModelChange({
                        provider: "openrouter",
                        model: preset.preferred_model,
                    });
                }
            } catch (err) {
                console.error("Failed to load preset model:", err);
            }
        };

        applyPresetModel();
    }, [selectedPreset, handleModelChange]);

    const mockWorkflows: Tool[] = [
        { id: "wf-1", type: "workflow", name: "Code Review Assistant", description: "Automated code review with best practices" },
        { id: "wf-2", type: "workflow", name: "Content Writer", description: "Generate blog posts with SEO optimization" },
    ];

    const mockMcpTools: Tool[] = [
        { id: "mcp-1", type: "mcp", name: "Web Search", description: "Search the web for real-time information" },
        { id: "mcp-2", type: "mcp", name: "Code Executor", description: "Run code in a sandboxed environment" },
    ];

    const handleSend = useCallback(
        async (content: string) => {
            if (!user) {
                toast.error("You must be logged in to chat");
                return;
            }

            const modelAtSend = selectedModelRef.current;

            // Create or get conversation — conversationId is in deps so this is never stale
            let currentConversationId = conversationId;
            if (!currentConversationId) {
                try {
                    const title = content.slice(0, 100);
                    const conversation = await conversationsService.createConversation({
                        user_id: user.id,
                        title,
                    });
                    currentConversationId = conversation.id;
                    setConversationId(currentConversationId);
                    onConversationCreated?.(conversation.id, title);
                } catch (error) {
                    console.error("Failed to create conversation:", error);
                    toast.error("Failed to create conversation. Check your Supabase connection.");
                    return;
                }
            }

            if (!currentConversationId) {
                toast.error("Failed to create conversation");
                return;
            }

            const userMessage: Message = {
                id: `user-${Date.now()}`,
                role: "user",
                content,
                timestamp: new Date(),
            };

            // Save user message to DB (non-blocking)
            messagesService.createMessage({
                conversation_id: currentConversationId,
                role: "user",
                content,
                provider: "openrouter",
                model: modelAtSend.model,
            }).catch((e) => console.error("Failed to save user message:", e));

            const assistantMessageId = `assistant-${Date.now()}`;
            const assistantMessage: Message = {
                id: assistantMessageId,
                role: "assistant",
                content: "",
                timestamp: new Date(),
                model: modelAtSend.model,
            };

            setMessages((prev) => [...prev, userMessage, assistantMessage]);
            setIsStreaming(true);
            setStreamingMessageId(assistantMessageId);

            // Fetch the user's OpenRouter API key directly from DB right now — no stale cache
            const { data: keyRow } = await supabase
                .from('user_api_keys')
                .select('api_key')
                .eq('provider', 'openrouter')
                .eq('enabled', true)
                .maybeSingle();

            const apiKey = keyRow?.api_key ?? null;

            if (!apiKey) {
                toast.error("OpenRouter API key not found", {
                    description: "Go to Settings → LLM Providers and save your OpenRouter API key.",
                });
                setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
                setIsStreaming(false);
                setStreamingMessageId(undefined);
                return;
            }

            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
                const headers: Record<string, string> = {
                    "Content-Type": "application/json",
                    "x-openrouter-api-key": apiKey,
                };

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        messages: [
                            ...messages.map((m) => ({ role: m.role, content: m.content })),
                            { role: "user", content },
                        ],
                        model: modelAtSend.model,
                        conversationId: currentConversationId,
                        presetId: selectedPreset,
                        workflowId: selectedTool?.type === "workflow" ? selectedTool.id : undefined,
                        mcpToolId: selectedTool?.type === "mcp" ? selectedTool.id : undefined,
                    }),
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    const errMsg = errBody?.error || `HTTP ${response.status}`;
                    throw new Error(errMsg);
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                if (!reader) throw new Error("No response body");

                let accumulatedContent = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const lines = decoder.decode(value, { stream: true }).split("\n");
                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;
                        const data = line.slice(6);
                        if (data === "[DONE]") continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                accumulatedContent += parsed.content;
                                setMessages((prev) =>
                                    prev.map((m) =>
                                        m.id === assistantMessageId
                                            ? { ...m, content: accumulatedContent }
                                            : m
                                    )
                                );
                            }
                        } catch {
                            // Incomplete chunk — ignore
                        }
                    }
                }

                setIsStreaming(false);
                setStreamingMessageId(undefined);

                // Save assistant message to DB (non-blocking)
                if (accumulatedContent) {
                    messagesService.createMessage({
                        conversation_id: currentConversationId,
                        role: "assistant",
                        content: accumulatedContent,
                        provider: "openrouter",
                        model: modelAtSend.model,
                    }).catch((e) => console.error("Failed to save assistant message:", e));
                }

            } catch (error: any) {
                if (error.name === "AbortError") {
                    toast.info("Generation stopped");
                } else {
                    const msg: string = error.message || "";
                    console.error("Chat error:", msg);
                    if (msg.includes("API key") || msg.includes("401") || msg.includes("key not configured")) {
                        toast.error("API key not configured", {
                            description: "Go to Settings → LLM Providers and add your OpenRouter key.",
                        });
                    } else if (msg.includes("No endpoints found")) {
                        toast.error("Model unavailable", {
                            description: "The selected model has no available endpoints. Try a different model.",
                        });
                    } else {
                        toast.error("Failed to generate response", { description: msg });
                    }
                    setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
                }
                setIsStreaming(false);
                setStreamingMessageId(undefined);
            } finally {
                abortControllerRef.current = null;
            }
        },
        // conversationId MUST be in deps to avoid stale closure creating duplicate conversations
        [user, messages, conversationId, selectedPreset, selectedTool, onConversationCreated]
    );

    const handleStop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const handleNewChat = useCallback(() => {
        if (isStreaming) {
            toast.error("Please wait for the current response to complete");
            return;
        }
        setMessages([]);
        setConversationId(null);
        setSelectedPreset(null);
        setSelectedTool(null);
    }, [isStreaming]);

    const hasMessages = messages.length > 0;

    return (
        <div className="flex flex-col h-screen bg-zinc-950 relative overflow-hidden">
            {/* Top bar with model, preset, tools, and new chat */}
            {hasMessages && (
                <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 py-3">
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                        <ModelSelector
                            value={selectedModel}
                            onChange={handleModelChange}
                            className="min-w-[200px]"
                        />
                        <PresetSelector
                            value={selectedPreset || undefined}
                            onChange={setSelectedPreset}
                            className="min-w-[180px]"
                        />
                        <ToolsDropdown
                            workflows={mockWorkflows}
                            mcpTools={mockMcpTools}
                            selectedTool={selectedTool}
                            onSelectTool={setSelectedTool}
                            className="min-w-[180px]"
                        />
                        <div className="flex-1" />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNewChat}
                            disabled={isStreaming}
                            className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Chat
                        </Button>
                    </div>
                </div>
            )}

            {/* Messages area */}
            {hasMessages && (
                <div className="flex-1 overflow-y-auto">
                    <EnhancedMessageList
                        messages={messages}
                        streamingMessageId={streamingMessageId}
                        isStreaming={isStreaming}
                    />
                </div>
            )}

            {/* Chat input (centered when empty, bottom when has messages) */}
            <div className={hasMessages ? "border-t border-zinc-800 p-4" : "flex-1 flex items-center justify-center"}>
                <EnhancedChatInput
                    onSend={handleSend}
                    onStop={handleStop}
                    isStreaming={isStreaming}
                    hasMessages={hasMessages}
                    model={selectedModel}
                    onModelChange={handleModelChange}
                    selectedPreset={selectedPreset}
                    onPresetChange={setSelectedPreset}
                    selectedTool={selectedTool}
                    onToolChange={setSelectedTool}
                    workflows={mockWorkflows}
                    mcpTools={mockMcpTools}
                    disabled={!user}
                    placeholder={
                        user
                            ? "Ask me anything..."
                            : "Please log in to start chatting"
                    }
                />
            </div>
        </div>
    );
}
