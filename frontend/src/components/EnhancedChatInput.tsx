"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, StopCircle, Sparkles, Zap, Hand, Ban, X, Image as ImageIcon, Mic } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { ModelSelector } from "@/src/components/ModelSelector";
import { PresetSelector } from "@/src/components/PresetSelector";
import { ToolsDropdown, type Tool } from "@/src/components/ToolsDropdown";
import { ToolMention, type MentionItem } from "@/src/components/ToolMention";
import { DEFAULT_MODEL, type ChatModel } from "@/src/lib/models/openrouter";
import { cn } from "@/src/lib/utils";

export type ToolMode = "auto" | "manual" | "none";

interface EnhancedChatInputProps {
    onSend: (message: string, mentions?: MentionItem[]) => void;
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
    agents?: MentionItem[];
    placeholder?: string;
    disabled?: boolean;
    toolMode?: ToolMode;
    onToolModeChange?: (mode: ToolMode) => void;
    onImageGenClick?: () => void;
    onVoiceClick?: () => void;
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
    agents = [],
    placeholder = "Ask me anything… type @ to mention a tool",
    disabled = false,
    toolMode = "auto",
    onToolModeChange,
    onImageGenClick,
    onVoiceClick,
}: EnhancedChatInputProps) {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [mentions, setMentions] = useState<MentionItem[]>([]);
    // @ mention state
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Build full mention item list from workflows + mcpTools + agents
    const allMentionItems: MentionItem[] = [
        ...agents,
        ...workflows.map((w) => ({ id: w.id, type: "workflow" as const, name: w.name, description: w.description })),
        ...mcpTools.map((t) => ({ id: t.id, type: "tool" as const, name: t.name, description: t.description })),
    ];

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    // Detect @ trigger in input
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        const cursor = e.target.selectionStart ?? value.length;
        // Look backwards from cursor for an @ with no space after it
        const textBeforeCursor = value.slice(0, cursor);
        const match = textBeforeCursor.match(/@(\w*)$/);
        if (match) {
            setMentionQuery(match[1]);
            // Get bounding rect of the textarea for popup anchoring
            if (textareaRef.current) {
                setAnchorRect(textareaRef.current.getBoundingClientRect());
            }
        } else {
            setMentionQuery(null);
            setAnchorRect(null);
        }
    }, []);

    const handleMentionSelect = useCallback((item: MentionItem) => {
        // Replace the @query with @name in the input
        const cursor = textareaRef.current?.selectionStart ?? input.length;
        const textBeforeCursor = input.slice(0, cursor);
        const replaced = textBeforeCursor.replace(/@(\w*)$/, `@${item.name} `);
        const newValue = replaced + input.slice(cursor);
        setInput(newValue);
        setMentionQuery(null);
        setAnchorRect(null);
        setMentions((prev) => [...prev.filter((m) => m.id !== item.id), item]);
        // Restore focus
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const pos = replaced.length;
                textareaRef.current.setSelectionRange(pos, pos);
            }
        }, 0);
    }, [input]);

    const removeMention = (id: string) => {
        setMentions((prev) => prev.filter((m) => m.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isStreaming || disabled) return;
        onSend(input, mentions.length > 0 ? mentions : undefined);
        setInput("");
        setMentions([]);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // When mention popup is open, don't intercept Enter/ArrowUp/ArrowDown
        if (mentionQuery !== null) return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const toolModeConfig: { mode: ToolMode; label: string; icon: React.ReactNode; color: string }[] = [
        { mode: "auto", label: "Auto", icon: <Zap className="w-3 h-3" />, color: "text-amber-400" },
        { mode: "manual", label: "Manual", icon: <Hand className="w-3 h-3" />, color: "text-emerald-400" },
        { mode: "none", label: "None", icon: <Ban className="w-3 h-3" />, color: "text-zinc-500" },
    ];

    return (
        <div
            className={cn(
                "w-full max-w-3xl mx-auto transition-all duration-500 ease-in-out",
                !hasMessages && "px-4"
            )}
        >
            {/* @ mention popup */}
            {mentionQuery !== null && (
                <ToolMention
                    query={mentionQuery}
                    items={allMentionItems}
                    anchorRect={anchorRect}
                    onSelect={handleMentionSelect}
                    onClose={() => { setMentionQuery(null); setAnchorRect(null); }}
                />
            )}

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
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600"
                        >
                            <Sparkles className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                            What can I help you create today?
                        </h1>
                        <p className="text-zinc-500">
                            Choose a model and start chatting with AI · type <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 text-sm">@</kbd> to mention a tool
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
                {/* Model/preset/tool selectors — show in header when no messages */}
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

                {/* Tool mode toggle */}
                {onToolModeChange && (
                    <div className="flex items-center gap-1 px-4 pt-3 pb-1">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 mr-2">Tool mode</span>
                        {toolModeConfig.map(({ mode, label, icon, color }) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => onToolModeChange(mode)}
                                className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all border",
                                    toolMode === mode
                                        ? `bg-zinc-800 border-zinc-600 ${color}`
                                        : "border-transparent text-zinc-600 hover:text-zinc-400"
                                )}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Active mention chips */}
                {mentions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-4 pt-2">
                        {mentions.map((m) => (
                            <span
                                key={m.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-xs text-indigo-300"
                            >
                                @{m.name}
                                <button
                                    type="button"
                                    onClick={() => removeMention(m.id)}
                                    className="ml-0.5 hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Input area */}
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
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

                    {/* Bottom action bar */}
                    <div className="flex items-center justify-between px-4 pb-4">
                        {/* Left: extra action buttons */}
                        <div className="flex items-center gap-1">
                            {onImageGenClick && (
                                <button
                                    type="button"
                                    onClick={onImageGenClick}
                                    title="Generate image"
                                    className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                            )}
                            {onVoiceClick && (
                                <button
                                    type="button"
                                    onClick={onVoiceClick}
                                    title="Voice input"
                                    className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <Mic className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Right: Stop / Send */}
                        <div className="flex items-center gap-2">
                            {isStreaming ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={onStop}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                                >
                                    <StopCircle className="w-4 h-4 mr-1" />
                                    Stop
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!input.trim() || disabled}
                                    className={cn(
                                        "rounded-xl transition-all duration-200",
                                        input.trim() && !disabled
                                            ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/50"
                                            : ""
                                    )}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send
                                </Button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Footer hint */}
                <div className="px-4 pb-3 text-xs text-zinc-600">
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Enter</kbd> send ·{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Shift+Enter</kbd> new line ·{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">@</kbd> mention tool
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
