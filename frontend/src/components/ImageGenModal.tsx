"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, Download, Send, RefreshCw, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

export type ImageProvider = "openai" | "gemini" | "xai";

interface GeneratedImage {
    id: string;
    prompt: string;
    url: string;
    provider: ImageProvider;
    createdAt: Date;
}

interface ImageGenModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Called when user clicks "Insert into chat" */
    onInsert?: (imageUrl: string, prompt: string) => void;
}

// ── Real image generation via /api/image-gen ──────────────────────────────
async function generateImage(
    prompt: string,
    provider: ImageProvider,
    size: string,
    quality: "standard" | "hd",
    style: "vivid" | "natural"
): Promise<string> {
    const res = await fetch("/api/image-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, provider: provider === "xai" ? "openai" : provider, size, quality, style }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Image generation failed (${res.status})`);
    }
    const data = await res.json();
    return data.url as string;
}

const PROVIDERS: { id: ImageProvider; label: string; badge: string }[] = [
    { id: "openai", label: "DALL·E 3", badge: "OpenAI" },
    { id: "gemini", label: "Imagen 3", badge: "Google" },
    { id: "xai", label: "Aurora", badge: "xAI" },
];

export function ImageGenModal({ open, onOpenChange, onInsert }: ImageGenModalProps) {
    const [prompt, setPrompt] = useState("");
    const [provider, setProvider] = useState<ImageProvider>("gemini");
    const [size, setSize] = useState("1024x1024");
    const [quality, setQuality] = useState<"standard" | "hd">("standard");
    const [style, setStyle] = useState<"vivid" | "natural">("vivid");
    const [isGenerating, setIsGenerating] = useState(false);
    const [gallery, setGallery] = useState<GeneratedImage[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);
        try {
            const url = await generateImage(prompt, provider, size, quality, style);
            const img: GeneratedImage = {
                id: `img-${Date.now()}`,
                prompt,
                url,
                provider,
                createdAt: new Date(),
            };
            setGallery((prev) => [img, ...prev]);
            setSelectedId(img.id);
        } catch (e: any) {
            setError(e?.message || "Image generation failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    const selectedImage = gallery.find((g) => g.id === selectedId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                        <ImageIcon className="w-5 h-5 text-indigo-400" />
                        Image Generation
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    {/* Provider selector */}
                    <div className="flex gap-2">
                        {PROVIDERS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setProvider(p.id)}
                                className={cn(
                                    "flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all",
                                    provider === p.id
                                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                )}
                            >
                                <div className="font-semibold">{p.label}</div>
                                <div className="text-[10px] text-zinc-500">{p.badge}</div>
                            </button>
                        ))}
                    </div>

                    {/* Size / Quality / Style */}
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="flex-1 min-w-0 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                        >
                            <option value="1024x1024">1024 × 1024</option>
                            <option value="1792x1024">1792 × 1024 (wide)</option>
                            <option value="1024x1792">1024 × 1792 (tall)</option>
                        </select>
                        {provider === "openai" && (
                            <>
                                <select
                                    value={quality}
                                    onChange={(e) => setQuality(e.target.value as "standard" | "hd")}
                                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                                >
                                    <option value="standard">Standard</option>
                                    <option value="hd">HD</option>
                                </select>
                                <select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value as "vivid" | "natural")}
                                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                                >
                                    <option value="vivid">Vivid</option>
                                    <option value="natural">Natural</option>
                                </select>
                            </>
                        )}
                    </div>

                    {/* Prompt input */}
                    <div className="flex gap-2">
                        <Input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                            placeholder="Describe the image you want to generate…"
                            className="bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 flex-1"
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isGenerating}
                            className="bg-indigo-600 hover:bg-indigo-500 px-4"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Preview + gallery */}
                    {gallery.length > 0 && (
                        <div className="space-y-3">
                            {/* Selected image preview */}
                            {selectedImage && (
                                <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.prompt}
                                        className="w-full max-h-64 object-cover"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-xs text-zinc-300 truncate">{selectedImage.prompt}</p>
                                    </div>
                                </div>
                            )}

                            {/* Thumbnail strip */}
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {gallery.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedId(img.id)}
                                        className={cn(
                                            "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                                            selectedId === img.id
                                                ? "border-indigo-500"
                                                : "border-zinc-800 hover:border-zinc-600"
                                        )}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {selectedImage && (
                        <div className="flex gap-2 pt-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex-1"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                Regenerate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                asChild
                            >
                                <a href={selectedImage.url} download="nexus-image.png" target="_blank" rel="noreferrer">
                                    <Download className="w-3.5 h-3.5" />
                                </a>
                            </Button>
                            {onInsert && (
                                <Button
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-500 flex-1"
                                    onClick={() => {
                                        onInsert(selectedImage.url, selectedImage.prompt);
                                        onOpenChange(false);
                                    }}
                                >
                                    Insert into chat
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
