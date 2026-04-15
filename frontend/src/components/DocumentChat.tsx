"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, FileText, Bot, User } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase";

interface DocumentChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface DocumentInfo {
    id: string;
    name: string;
    file_type: string;
    chunk_count: number;
}

interface DocumentChatProps {
    document: DocumentInfo;
    onBack: () => void;
}

export function DocumentChat({ document, onBack }: DocumentChatProps) {
    const [messages, setMessages] = useState<DocumentChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = useCallback(async () => {
        const content = input.trim();
        if (!content || isGenerating) return;

        const userMsg: DocumentChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content,
            timestamp: new Date(),
        };

        const assistantId = `assistant-${Date.now()}`;
        const assistantMsg: DocumentChatMessage = {
            id: assistantId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setInput("");
        setIsGenerating(true);

        try {
            const chatMessages = [...messages, userMsg].map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token ?? "";

            const response = await fetch("/api/documents/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    documentId: document.id,
                    messages: chatMessages,
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `HTTP ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No response body");

            let accumulated = "";

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
                        if (parsed.error) throw new Error(parsed.error);
                        if (parsed.content) {
                            accumulated += parsed.content;
                            setMessages((prev) =>
                                prev.map((m) =>
                                    m.id === assistantId ? { ...m, content: accumulated } : m
                                )
                            );
                        }
                    } catch (e) {
                        if (e instanceof Error && !e.message.includes("Unexpected end of JSON")) {
                            throw e;
                        }
                    }
                }
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Failed to get response";
            toast.error("Document chat error", { description: msg });
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        } finally {
            setIsGenerating(false);
        }
    }, [input, isGenerating, messages, document.id]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 py-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="text-zinc-400 hover:text-zinc-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                    </Button>
                    <div className="w-px h-6 bg-zinc-800" />
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-200 truncate">
                            {document.name}
                        </h3>
                        <p className="text-xs text-zinc-500">
                            {document.chunk_count} chunks indexed • Ask questions about this document
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                {!hasMessages && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-200 mb-2">
                            Chat with &ldquo;{document.name}&rdquo;
                        </h3>
                        <p className="text-sm text-zinc-500 max-w-md mb-6">
                            Ask questions about this document. The AI will answer based on the document&apos;s content and cite relevant sections.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                            {[
                                "Summarize this document",
                                "What are the key points?",
                                "What conclusions are drawn?",
                                "List any action items",
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => {
                                        setInput(suggestion);
                                        setTimeout(() => handleSend(), 0);
                                    }}
                                    className="px-3 py-2 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-700 transition-all text-left"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {hasMessages && (
                    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-3",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Bot className="w-4 h-4 text-indigo-400" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-3 max-w-[80%]",
                                        msg.role === "user"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                                    )}
                                >
                                    {msg.role === "assistant" && !msg.content && isGenerating ? (
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-sm">Analyzing document...</span>
                                        </div>
                                    ) : msg.role === "assistant" ? (
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <User className="w-4 h-4 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 p-4">
                <div className="max-w-3xl mx-auto flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about this document..."
                        rows={1}
                        className="flex-1 resize-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-500 px-4 self-end"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
