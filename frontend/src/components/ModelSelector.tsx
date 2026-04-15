"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { OPENROUTER_FREE_MODELS, type ChatModel, DEFAULT_MODEL } from "@/src/lib/models/openrouter";
import { cn } from "@/src/lib/utils";

interface ModelSelectorProps {
    value?: ChatModel;
    onChange: (model: ChatModel) => void;
    className?: string;
}

export function ModelSelector({ value, onChange, className }: ModelSelectorProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const currentValue = value || DEFAULT_MODEL;
    const selectedModel = OPENROUTER_FREE_MODELS.find((m) => m.id === currentValue.model);

    const filtered = OPENROUTER_FREE_MODELS.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.provider.toLowerCase().includes(search.toLowerCase()) ||
            m.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (modelId: string) => {
        onChange({ provider: "openrouter", model: modelId });
        setOpen(false);
        setSearch("");
    };

    return (
        <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch(""); }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="truncate font-medium">
                            {selectedModel?.name || "Select model..."}
                        </span>
                        {selectedModel && (
                            <span className="text-xs text-zinc-500 hidden sm:inline flex-shrink-0">
                                 {selectedModel.provider}
                            </span>
                        )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-zinc-400" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 bg-zinc-900 border-zinc-800" align="start" sideOffset={8}>
                <div className="flex items-center border-b border-zinc-800 px-3">
                    <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search models..."
                        className="flex-1 bg-transparent py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {filtered.length === 0 && (
                        <p className="py-6 text-center text-sm text-zinc-500">No model found.</p>
                    )}
                    {filtered.map((model) => (
                        <button
                            key={model.id}
                            type="button"
                            className="w-full flex items-start justify-between gap-3 px-3 py-2.5 text-left hover:bg-zinc-800 transition-colors cursor-pointer"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(model.id);
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-zinc-100">{model.name}</span>
                                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                                        FREE
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-0.5">{model.description}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-600">
                                    <span>{model.provider}</span>
                                    <span></span>
                                    <span>{model.contextLength.toLocaleString()} tokens</span>
                                </div>
                            </div>
                            <Check
                                className={cn(
                                    "h-4 w-4 shrink-0 mt-0.5 text-emerald-500",
                                    currentValue.model === model.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
