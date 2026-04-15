"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Workflow, Wrench, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface MentionItem {
    id: string;
    type: "agent" | "workflow" | "tool";
    name: string;
    description: string;
}

interface ToolMentionProps {
    /** The typed query after the @ symbol */
    query: string;
    items: MentionItem[];
    anchorRect: DOMRect | null;
    onSelect: (item: MentionItem) => void;
    onClose: () => void;
}

const typeIcon = {
    agent: <Bot className="w-3.5 h-3.5 text-purple-400" />,
    workflow: <Workflow className="w-3.5 h-3.5 text-emerald-400" />,
    tool: <Wrench className="w-3.5 h-3.5 text-blue-400" />,
};

const typeLabel = {
    agent: "Agent",
    workflow: "Workflow",
    tool: "Tool",
};

export function ToolMention({ query, items, anchorRect, onSelect, onClose }: ToolMentionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const filtered = items.filter(
        (item) =>
            !query ||
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
    );

    // Reset active index when filter changes
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    // Scroll active item into view
    useEffect(() => {
        const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
        activeEl?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    // Keyboard navigation — attach to document to intercept before the textarea
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filtered[activeIndex]) onSelect(filtered[activeIndex]);
            } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };
        document.addEventListener("keydown", handler, { capture: true });
        return () => document.removeEventListener("keydown", handler, { capture: true });
    }, [activeIndex, filtered, onSelect, onClose]);

    if (!anchorRect || filtered.length === 0) return null;

    // Position the popup above the textarea caret area
    const style: React.CSSProperties = {
        position: "fixed",
        bottom: window.innerHeight - anchorRect.top + 8,
        left: Math.min(anchorRect.left, window.innerWidth - 320),
        zIndex: 50,
        width: 320,
    };

    return (
        <div
            style={style}
            className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                <Search className="w-3 h-3" />
                Mention a tool, agent, or workflow
            </div>
            <div ref={listRef} className="max-h-56 overflow-y-auto py-1">
                {filtered.map((item, i) => (
                    <button
                        key={item.id}
                        data-index={i}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(item);
                        }}
                        className={cn(
                            "w-full flex items-start gap-3 px-3 py-2 text-left transition-colors",
                            i === activeIndex
                                ? "bg-indigo-600/30 border-l-2 border-indigo-500"
                                : "hover:bg-zinc-800 border-l-2 border-transparent"
                        )}
                    >
                        <div className="mt-0.5 flex-shrink-0">{typeIcon[item.type]}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                                    {typeLabel[item.type]}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 truncate">{item.description}</p>
                        </div>
                    </button>
                ))}
            </div>
            <div className="px-3 py-1.5 border-t border-zinc-800 text-[10px] text-zinc-600 flex gap-3">
                <span>↑↓ navigate</span>
                <span>Enter select</span>
                <span>Esc close</span>
            </div>
        </div>
    );
}
