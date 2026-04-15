"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { ModelSelector } from "./ModelSelector";
import { DEFAULT_MODEL } from "@/src/lib/models/openrouter";
import type { Preset } from "@/src/lib/services/presets";
import type { ChatModel } from "@/src/lib/models/openrouter";

interface PresetEditorModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: PresetFormData) => Promise<void>;
    preset?: Preset | null;
}

export interface PresetFormData {
    name: string;
    description: string;
    system_prompt: string;
    temperature: number;
    max_tokens: number;
    preferred_model: string;
}

export function PresetEditorModal({
    open,
    onClose,
    onSave,
    preset,
}: PresetEditorModalProps) {
    const [formData, setFormData] = useState<PresetFormData>({
        name: "",
        description: "",
        system_prompt: "",
        temperature: 0.7,
        max_tokens: 2048,
        preferred_model: DEFAULT_MODEL.model,
    });
    const [model, setModel] = useState<ChatModel>(DEFAULT_MODEL);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; system_prompt?: string }>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (preset) {
            setFormData({
                name: preset.name,
                description: preset.description || "",
                system_prompt: preset.system_prompt,
                temperature: preset.temperature ?? 0.7,
                max_tokens: preset.max_tokens ?? 2048,
                preferred_model: preset.preferred_model ?? DEFAULT_MODEL.model,
            });
            setModel({ provider: "openrouter", model: preset.preferred_model ?? DEFAULT_MODEL.model });
        } else {
            setFormData({ name: "", description: "", system_prompt: "", temperature: 0.7, max_tokens: 2048, preferred_model: DEFAULT_MODEL.model });
            setModel(DEFAULT_MODEL);
        }
        setErrors({});
        setSubmitError(null);
    }, [preset, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Manual validation so errors are visible
        const newErrors: typeof errors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.system_prompt.trim()) newErrors.system_prompt = "System prompt is required";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setSubmitError(null);
        setSaving(true);
        try {
            await Promise.race([
                onSave({ ...formData, preferred_model: model.model }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Saving preset timed out. Please try again.")), 15000)
                ),
            ]);
        } catch (error: any) {
            setSubmitError(error?.message || "Failed to save preset");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o && !saving) onClose(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-xl">{preset ? "Edit Preset" : "Create New Preset"}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {preset ? "Update the preset configuration" : "Create a custom preset with a system prompt and model settings"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-zinc-200">Name <span className="text-red-400">*</span></Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: undefined })); }}
                            placeholder="e.g., Creative Writer, Code Assistant"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        />
                        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-zinc-200">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Brief description of this preset"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        />
                    </div>

                    {/* System Prompt */}
                    <div className="space-y-1.5">
                        <Label htmlFor="system_prompt" className="text-zinc-200">System Prompt <span className="text-red-400">*</span></Label>
                        <Textarea
                            id="system_prompt"
                            value={formData.system_prompt}
                            onChange={(e) => { setFormData((p) => ({ ...p, system_prompt: e.target.value })); setErrors((p) => ({ ...p, system_prompt: undefined })); }}
                            placeholder="You are a helpful assistant..."
                            rows={6}
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none"
                        />
                        {errors.system_prompt && <p className="text-xs text-red-400">{errors.system_prompt}</p>}
                        <p className="text-xs text-zinc-500">The system prompt defines the AI's behavior and personality</p>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-1.5">
                        <Label className="text-zinc-200">Preferred Model</Label>
                        <ModelSelector value={model} onChange={setModel} />
                        <p className="text-xs text-zinc-500">This model will be used by default when this preset is active</p>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-1.5">
                        <Label htmlFor="temperature" className="text-zinc-200">Temperature: {formData.temperature}</Label>
                        <input
                            type="range" id="temperature" min="0" max="2" step="0.1"
                            value={formData.temperature}
                            onChange={(e) => setFormData((p) => ({ ...p, temperature: parseFloat(e.target.value) }))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Focused (0)</span><span>Balanced (1)</span><span>Creative (2)</span>
                        </div>
                    </div>

                    {/* Max Tokens */}
                    <div className="space-y-1.5">
                        <Label htmlFor="max_tokens" className="text-zinc-200">Max Tokens</Label>
                        <Input
                            type="number" id="max_tokens"
                            value={formData.max_tokens}
                            onChange={(e) => setFormData((p) => ({ ...p, max_tokens: parseInt(e.target.value) || 2048 }))}
                            min="256" max="32768" step="256"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100"
                        />
                    </div>

                    <DialogFooter>
                        {submitError && (
                            <p className="text-xs text-red-400 mr-auto">{submitError}</p>
                        )}
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving}
                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white">
                            {saving ? "Saving..." : preset ? "Update Preset" : "Create Preset"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
