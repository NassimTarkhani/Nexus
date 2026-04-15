"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, StopCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { ModelSelector } from "@/src/components/ModelSelector";
import { PresetSelector } from "@/src/components/PresetSelector";
import { ToolsDropdown, type Tool } from "@/src/components/ToolsDropdown";
import { DEFAULT_MODEL, type ChatModel } from "@/src/lib/models/openrouter";
import { cn } from "@/src/lib/utils";

interface EnhancedChatInputProps {
    onSend: (message: string) => void;
    onStop?: () => void;
    isStreaming: boolean;
    hasMessages: boolean;
    model: ChatModel;
    onModelChange: (model: ChatModel) => void;
    selectedPreset?: string | null;
    onPresetChange?: (presetId: string | null) => void;
    selectedTool?: Tool | null;
    onToolChange?: (tool: Tool | null) => void;
    workflows?: Tool[];
    mcpTools?: Tool[];
    placeholder?: string;
    disabled?: boolean;
}

export function EnhancedChatInput({
    onSend,
    onStop,
    isStreaming,
    hasMessages,
    model,
    onModelChange,
    selectedPreset,
    onPresetChange,
    selectedTool,
    onToolChange,
    workflows = [],
    mcpTools = [],
    placeholder = "Ask me anything...",
    disabled = false,
}: EnhancedChatInputProps) {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming || disabled) return;

        onSend(input);
        setInput("");

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // When no messages, parent container centers this via flex
    // When has messages, it's positioned at the bottom

    return (
        <div
            className={cn(
                "w-full max-w-3xl mx-auto transition-all duration-500 ease-in-out",
                !hasMessages && "px-4"
            )}
        >
            {/* Welcome message when no messages */}
            <AnimatePresence>
                {!hasMessages && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.1,
                            }}
                            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                            What can I help you create today?
                        </h1>
                        <p className="text-zinc-500">
                            Choose a model and start chatting with AI
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: hasMessages ? 0 : 0.2 }}
                className={cn(
                    "relative rounded-2xl border backdrop-blur-sm transition-all duration-200",
                    isFocused
                        ? "border-indigo-500 bg-zinc-900/95 shadow-lg shadow-indigo-500/20"
                        : "border-zinc-800 bg-zinc-900/80",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {/* Model selector header - only show when no messages (centered mode) */}
                {!hasMessages && (
                    <div className="flex flex-col gap-2 px-4 py-3 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                            <ModelSelector value={model} onChange={onModelChange} className="flex-1" />
                            {onPresetChange && (
                                <PresetSelector
                                    value={selectedPreset || undefined}
                                    onChange={onPresetChange}
                                    className="flex-1"
                                />
                            )}
                        </div>
                        {onToolChange && workflows && mcpTools && (
                            <ToolsDropdown
                                workflows={workflows}
                                mcpTools={mcpTools}
                                selectedTool={selectedTool || null}
                                onSelectTool={onToolChange}
                                className="w-full"
                            />
                        )}
                        {isStreaming && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onStop}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <StopCircle className="w-4 h-4 mr-2" />
                                Stop
                            </Button>
                        )}
                    </div>
                )}

                {/* Input area */}
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        disabled={disabled || isStreaming}
                        className={cn(
                            "min-h-[60px] max-h-[300px] w-full resize-none border-0 bg-transparent px-4 py-4 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-0",
                            "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                        )}
                        rows={1}
                    />

                    {/* Send button */}
                    <div className="flex items-center justify-end px-4 pb-4">
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!input.trim() || isStreaming || disabled}
                            className={cn(
                                "rounded-xl transition-all duration-200",
                                input.trim() && !isStreaming && !disabled
                                    ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/50"
                                    : ""
                            )}
                        >
                            {isStreaming ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Footer hint */}
                <div className="px-4 pb-3 text-xs text-zinc-600">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Enter</kbd> to send,{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Shift + Enter</kbd> for new line
                </div>
            </motion.div>

            {/* Suggested prompts when no messages */}
            <AnimatePresence>
                {!hasMessages && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                        {[
                            { icon: "💡", text: "Explain quantum computing simply" },
                            { icon: "📝", text: "Write a product description" },
                            { icon: "🎨", text: "Generate creative ideas" },
                            { icon: "🔍", text: "Analyze this concept" },
                        ].map((prompt, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                onClick={() => setInput(prompt.text)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all"
                            >
                                <span className="text-2xl">{prompt.icon}</span>
                                <span className="text-zinc-300">{prompt.text}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
