"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { EnhancedChatInput } from "./EnhancedChatInput";
import { EnhancedMessageList, type Message } from "./EnhancedMessageList";
import { PresetSelector } from "./PresetSelector";
import { ModelSelector } from "./ModelSelector";
import { ToolsDropdown, type Tool } from "./ToolsDropdown";
import { ImageGenModal } from "./ImageGenModal";
import { VoiceAssistant } from "./VoiceAssistant";
import { DEFAULT_MODEL, type ChatModel } from "@/src/lib/models/openrouter";
import { useAuthStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";
import { conversationsService } from "@/src/lib/services/conversations";
import { messagesService } from "@/src/lib/services/messages";
import { getPreset } from "@/src/lib/services/presets";
import { useWorkflows, useMcpServers } from "@/src/lib/hooks/useDatabase";
import type { MentionItem } from "./ToolMention";
import { toast } from "sonner";

interface EnhancedChatWindowProps {
    // Optionally load an existing conversation
    loadConversationId?: string | null;
    onConversationCreated?: (id: string, title: string) => void;
    onMessagesChanged?: () => void;
}

export function EnhancedChatWindow({ loadConversationId, onConversationCreated, onMessagesChanged }: EnhancedChatWindowProps = {}) {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();
    const [selectedModel, setSelectedModel] = useState<ChatModel>(DEFAULT_MODEL);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [showVoice, setShowVoice] = useState(false);
    const [showImageGen, setShowImageGen] = useState(false);
    const [toolMode, setToolMode] = useState<"auto" | "manual" | "none">("none");
    // Use useRef (not useState) so mutations don't trigger re-renders
    const abortControllerRef = useRef<AbortController | null>(null);
    const selectedModelRef = useRef<ChatModel>(DEFAULT_MODEL);

    const handleModelChange = useCallback((model: ChatModel) => {
        selectedModelRef.current = model;
        setSelectedModel(model);
    }, []);

    // Load an existing conversation when loadConversationId changes
    useEffect(() => {
        if (!loadConversationId) return;
        // Clear immediately so old messages don't flash while loading
        setMessages([]);
        setConversationId(loadConversationId);
        setLoadingHistory(true);

        let cancelled = false;
        const load = async () => {
            try {
                const msgs = await messagesService.getMessages(loadConversationId);
                if (cancelled) return;
                const mapped: Message[] = msgs.map((m) => ({
                    id: m.id,
                    role: m.role as "user" | "assistant",
                    content: m.content,
                    timestamp: new Date(m.created_at),
                    model: m.model || undefined,
                }));
                setMessages(mapped);
            } catch (err) {
                if (cancelled) return;
                console.error("Failed to load conversation:", err);
                toast.error("Could not load conversation history");
            } finally {
                if (!cancelled) setLoadingHistory(false);
            }
        };
        load();
        return () => { cancelled = true; };
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

    // ── DB-backed tools ──────────────────────────────────────────────────
    const { workflows: dbWorkflows } = useWorkflows();
    const { mcpServers: dbMcpServers } = useMcpServers();

    const liveWorkflows: Tool[] = dbWorkflows.map((w) => ({
        id: w.id,
        type: "workflow" as const,
        name: w.name,
        description: w.description ?? "",
    }));

    const liveMcpTools: Tool[] = dbMcpServers.map((s) => ({
        id: s.id,
        type: "mcp" as const,
        name: s.name,
        description: s.description ?? "",
    }));

    const handleSend = useCallback(
        async (content: string, _mentions?: MentionItem[]) => {
            const modelAtSend = selectedModelRef.current;
            const canPersist = Boolean(user);

            // Create or get conversation — conversationId is in deps so this is never stale
            let currentConversationId = conversationId;
            if (!currentConversationId) {
                const title = content.slice(0, 100);

                if (canPersist && user) {
                    try {
                        const conversation = await conversationsService.createConversation({
                            user_id: user.id,
                            title,
                        });
                        currentConversationId = conversation.id;
                        setConversationId(currentConversationId);
                        onConversationCreated?.(conversation.id, title);
                    } catch (error) {
                        console.error("Failed to create conversation:", error);
                        currentConversationId = `local-${Date.now()}`;
                        setConversationId(currentConversationId);
                        toast.error("Database unavailable", {
                            description: "Chat will continue locally, but this conversation will not be saved.",
                        });
                    }
                } else {
                    currentConversationId = `local-${Date.now()}`;
                    setConversationId(currentConversationId);
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
            if (canPersist && !currentConversationId.startsWith("local-")) {
                messagesService.createMessage({
                    conversation_id: currentConversationId,
                    role: "user",
                    content,
                    provider: "openrouter",
                    model: modelAtSend.model,
                }).catch((e) => console.error("Failed to save user message:", e));
            }

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

            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
                const headers: Record<string, string> = {
                    "Content-Type": "application/json",
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
                        toolMode,
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
                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }
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
                        } catch (parseErr) {
                            // Re-throw real errors, ignore JSON parse failures
                            if (parseErr instanceof Error && parseErr.message !== 'Unexpected end of JSON input') {
                                throw parseErr;
                            }
                        }
                    }
                }

                setIsStreaming(false);
                setStreamingMessageId(undefined);

                // Persist assistant message + update conversation timestamp
                if (accumulatedContent && canPersist && !currentConversationId.startsWith("local-")) {
                    messagesService.createMessage({
                        conversation_id: currentConversationId,
                        role: 'assistant',
                        content: accumulatedContent,
                        provider: 'openrouter',
                        model: modelAtSend.model,
                    }).catch((e) => console.error("Failed to save assistant message:", e));

                    supabase
                        .from('conversations')
                        .update({ updated_at: new Date().toISOString() })
                        .eq('id', currentConversationId)
                        .then(() => onMessagesChanged?.());
                }

            } catch (error: unknown) {
                const err = error as Error;
                if (err.name === "AbortError") {
                    toast.info("Generation stopped");
                } else {
                    const msg: string = err.message || "";
                    console.error("Chat error:", msg);
                    if (msg.includes("User not found") || msg.includes("401") || msg.includes("API key") || msg.includes("key not configured") || msg.includes("Unauthorized")) {
                        toast.error("OpenRouter API key invalid", {
                            description: "The key in .env is expired or incorrect. Get a new key at openrouter.ai/keys.",
                        });
                    } else if (msg.includes("No endpoints found") || msg.includes("no endpoints")) {
                        toast.error("Model unavailable", {
                            description: "The selected model has no available endpoints. Try a different model.",
                        });
                    } else if (msg.includes("rate limit") || msg.includes("429")) {
                        toast.error("Rate limit hit", {
                            description: "Too many requests. Wait a moment and try again.",
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
        [user, messages, conversationId, selectedPreset, selectedTool, toolMode, onConversationCreated, onMessagesChanged]
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
                            workflows={liveWorkflows}
                            mcpTools={liveMcpTools}
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
            {loadingHistory && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-zinc-500">Loading conversation...</p>
                    </div>
                </div>
            )}
            {!loadingHistory && hasMessages && (
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
                {showVoice && (
                    <div className="flex justify-center pb-4">
                        <VoiceAssistant
                            onTranscript={(text) => {
                                handleSend(text);
                                setShowVoice(false);
                            }}
                        />
                    </div>
                )}
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
                    workflows={liveWorkflows}
                    mcpTools={liveMcpTools}
                    toolMode={toolMode}
                    onToolModeChange={setToolMode}
                    onVoiceClick={() => setShowVoice((v) => !v)}
                    onImageGenClick={() => setShowImageGen(true)}
                    placeholder={
                        user
                            ? "Ask me anything… type @ to mention a tool"
                            : "Ask me anything… sign in later if you want chat history saved"
                    }
                />
                <ImageGenModal
                    open={showImageGen}
                    onOpenChange={setShowImageGen}
                    onInsert={(url, prompt) => {
                        handleSend(`![${prompt}](${url})`);
                        setShowImageGen(false);
                    }}
                />
            </div>
        </div>
    );
}
