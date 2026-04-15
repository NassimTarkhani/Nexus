"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Bot, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp?: Date;
    model?: string;
}

interface EnhancedMessageListProps {
    messages: Message[];
    streamingMessageId?: string;
    isStreaming?: boolean;
}

export function EnhancedMessageList({
    messages,
    streamingMessageId,
    isStreaming = false,
}: EnhancedMessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streamingMessageId]);

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        >
            <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        isStreaming={message.id === streamingMessageId}
                        index={index}
                    />
                ))}
            </AnimatePresence>

            {/* Streaming indicator */}
            {isStreaming && !streamingMessageId && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-zinc-500"
                >
                    <Bot className="w-6 h-6" />
                    <div className="flex gap-1">
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 rounded-full bg-zinc-500"
                        />
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 rounded-full bg-zinc-500"
                        />
                        <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 rounded-full bg-zinc-500"
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

interface MessageBubbleProps {
    message: Message;
    isStreaming?: boolean;
    index: number;
}

function MessageBubble({ message, isStreaming, index }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 50,
                delay: index * 0.05,
            }}
            className={cn("flex gap-4", isUser && "flex-row-reverse")}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    isUser
                        ? "bg-gradient-to-br from-indigo-600 to-purple-600"
                        : "bg-gradient-to-br from-emerald-600 to-teal-600"
                )}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Message content */}
            <div className={cn("flex-1 max-w-3xl", isUser && "flex justify-end")}>
                <div
                    className={cn(
                        "rounded-2xl px-5 py-3 transition-all duration-200",
                        isUser
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-800/50 border border-zinc-700 text-zinc-100"
                    )}
                >
                    {isStreaming ? (
                        <div className="flex items-center gap-2 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating response...</span>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code: ({ className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const inline = !match;
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                // @ts-ignore - style type mismatch
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                className="rounded-lg my-2"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code
                                                className={cn(
                                                    "px-1.5 py-0.5 rounded font-mono text-sm",
                                                    isUser ? "bg-indigo-700" : "bg-zinc-700"
                                                )}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
                                    p({ children }) {
                                        return <p className="mb-2 last:mb-0">{children}</p>;
                                    },
                                    ul({ children }) {
                                        return <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>;
                                    },
                                    ol({ children }) {
                                        return <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>;
                                    },
                                    a({ href, children }) {
                                        return (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    "underline hover:no-underline transition-all",
                                                    isUser ? "text-indigo-200" : "text-indigo-400"
                                                )}
                                            >
                                                {children}
                                            </a>
                                        );
                                    },
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Model info for assistant messages */}
                    {!isUser && message.model && !isStreaming && (
                        <div className="mt-2 pt-2 border-t border-zinc-700 text-xs text-zinc-500">
                            Model: {message.model}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                    <div className="mt-1 px-2 text-xs text-zinc-600">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
