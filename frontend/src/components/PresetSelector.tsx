"use client";

import { useState } from "react";
import { Plus, Settings2, Copy, Trash2, Check, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { usePresets } from "@/src/lib/hooks/usePresets";
import { useAuthStore } from "@/src/lib/store";
import { cn } from "@/src/lib/utils";
import { PresetEditorModal } from "./PresetEditorModal";
import type { Preset } from "@/src/lib/services/presets";

interface PresetSelectorProps {
    value?: string;
    onChange: (presetId: string | null) => void;
    className?: string;
}

export function PresetSelector({ value, onChange, className }: PresetSelectorProps) {
    const { user } = useAuthStore();
    const { presets, loading, create, update, remove, duplicate } = usePresets();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

    const selectedPreset = presets.find((p) => p.id === value);

    const filtered = presets.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description || "").toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setEditingPreset(null);
        setEditorOpen(true);
        setOpen(false);
    };

    const handleEdit = (preset: Preset) => {
        setEditingPreset(preset);
        setEditorOpen(true);
        setOpen(false);
    };

    const handleDuplicate = async (preset: Preset) => {
        if (!user?.id) return;
        try {
            const newPreset = await duplicate(preset.id, user.id);
            onChange(newPreset.id);
        } catch (error) {
            console.error("Failed to duplicate preset:", error);
        }
    };

    const handleDelete = async (presetId: string) => {
        if (!confirm("Are you sure you want to delete this preset?")) return;
        try {
            await remove(presetId);
            if (value === presetId) onChange(null);
        } catch (error) {
            console.error("Failed to delete preset:", error);
        }
    };

    const handleSave = async (data: any) => {
        if (!user?.id) throw new Error("You must be signed in to save presets");
        try {
            if (editingPreset) {
                await update(editingPreset.id, data);
            } else {
                const newPreset = await create(user.id, data);
                onChange(newPreset.id);
            }
            setEditorOpen(false);
            setEditingPreset(null);
        } catch (error: any) {
            console.error("Failed to save preset:", error);
            const { toast } = await import("sonner");
            if (error?.message?.includes("user_presets table not found")) {
                toast.error("Presets Table Missing", {
                    description: "Run DATABASE_UPGRADE.sql in Supabase to enable presets.",
                    duration: 6000,
                });
            } else {
                toast.error("Failed to save preset", {
                    description: error?.message || "An unexpected error occurred",
                });
            }
            throw error;
        }
    };

    return (
        <>
            <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch(""); }}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800",
                            className
                        )}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <Settings2 className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                                {selectedPreset?.name || "No preset"}
                            </span>
                        </div>
                        {selectedPreset && (
                            <Check className="ml-2 h-4 w-4 text-emerald-500 flex-shrink-0" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0 bg-zinc-900 border-zinc-800" align="start" sideOffset={8}>
                    {/* Search */}
                    <div className="flex items-center border-b border-zinc-800 px-3">
                        <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                        <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search presets..."
                            className="flex-1 bg-transparent py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
                        />
                    </div>

                    <div className="max-h-[280px] overflow-y-auto">
                        {/* Clear / no-preset option */}
                        <button
                            type="button"
                            className={cn(
                                "w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-zinc-800 transition-colors",
                                !value && "bg-zinc-800"
                            )}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(null);
                                setOpen(false);
                            }}
                        >
                            <div className="w-4 h-4 flex-shrink-0" />
                            <span className="text-zinc-300">No preset (default)</span>
                            {!value && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                        </button>

                        {loading && (
                            <p className="py-4 text-center text-sm text-zinc-500">Loading...</p>
                        )}

                        {!loading && filtered.length === 0 && search && (
                            <p className="py-4 text-center text-sm text-zinc-500">No presets found</p>
                        )}

                        {!loading && presets.length === 0 && !search && (
                            <p className="py-4 text-center text-sm text-zinc-500">No presets yet</p>
                        )}

                        {filtered.map((preset) => (
                            <div
                                key={preset.id}
                                className={cn(
                                    "group flex items-center gap-2 px-3 py-2.5 hover:bg-zinc-800 transition-colors cursor-pointer",
                                    value === preset.id && "bg-zinc-800"
                                )}
                            >
                                <button
                                    type="button"
                                    className="flex-1 flex items-center gap-2 min-w-0 text-left"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        onChange(preset.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Settings2 className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-zinc-100 truncate">{preset.name}</div>
                                        {preset.description && (
                                            <div className="text-xs text-zinc-500 truncate">{preset.description}</div>
                                        )}
                                    </div>
                                    {value === preset.id && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                                </button>

                                {/* Action buttons */}
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => { e.stopPropagation(); handleEdit(preset); }}
                                    >
                                        <Settings2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => { e.stopPropagation(); handleDuplicate(preset); }}
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(preset.id); }}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create new */}
                    <div className="border-t border-zinc-800 p-2">
                        <button
                            type="button"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleCreate();
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Create new preset
                        </button>
                    </div>
                </PopoverContent>
            </Popover>

            <PresetEditorModal
                open={editorOpen}
                onClose={() => { setEditorOpen(false); setEditingPreset(null); }}
                onSave={handleSave}
                preset={editingPreset}
            />
        </>
    );
}
