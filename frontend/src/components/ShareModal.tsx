"use client";

import { useState } from "react";
import { Check, Copy, Globe, Link2, Lock, Share2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
type ShareableType = "agent" | "workflow" | "preset";
type ShareRole = "viewer" | "editor";
type ShareVisibility = "private" | "link" | "public";

interface ShareItem {
    type: ShareableType;
    id: string;
    name: string;
    /** Optional — if provided it's included in the JSON manifest */
    definition?: Record<string, unknown>;
}

interface ShareModalProps {
    item: ShareItem;
    /** Whether the dialog is open */
    open: boolean;
    onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function buildShareUrl(item: ShareItem, visibility: ShareVisibility): string {
    if (visibility === "private") return "";
    const base = typeof window !== "undefined" ? window.location.origin : "https://nexus.app";
    return `${base}/share/${item.type}/${item.id}`;
}

function buildManifest(item: ShareItem, role: ShareRole, visibility: ShareVisibility) {
    return JSON.stringify(
        {
            nexus_share: "1.0",
            type: item.type,
            id: item.id,
            name: item.name,
            role,
            visibility,
            exported_at: new Date().toISOString(),
            ...(item.definition ? { definition: item.definition } : {}),
        },
        null,
        2
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function CopyButton({
    text,
    label,
    className,
}: {
    text: string;
    label: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={copy}
            className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors",
                "bg-zinc-800 border border-zinc-700 hover:border-indigo-500 hover:bg-indigo-600/10 text-zinc-300",
                className
            )}
        >
            {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
                <Copy className="w-3.5 h-3.5" />
            )}
            {label}
        </button>
    );
}

const VISIBILITY_OPTIONS: { value: ShareVisibility; label: string; icon: React.ReactNode; desc: string }[] =
    [
        {
            value: "private",
            label: "Private",
            icon: <Lock className="w-4 h-4" />,
            desc: "Only you can access",
        },
        {
            value: "link",
            label: "Anyone with link",
            icon: <Link2 className="w-4 h-4" />,
            desc: "Share via URL",
        },
        {
            value: "public",
            label: "Public",
            icon: <Globe className="w-4 h-4" />,
            desc: "Listed in community",
        },
    ];

// ── Main component ─────────────────────────────────────────────────────────
export function ShareModal({ item, open, onClose }: ShareModalProps) {
    const [visibility, setVisibility] = useState<ShareVisibility>("link");
    const [role, setRole] = useState<ShareRole>("viewer");
    const [showManifest, setShowManifest] = useState(false);

    const shareUrl = buildShareUrl(item, visibility);
    const manifest = buildManifest(item, role, visibility);

    const typeLabel =
        item.type === "agent"
            ? "Agent"
            : item.type === "workflow"
                ? "Workflow"
                : "Preset";

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="pointer-events-auto w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
                                <Share2 className="w-5 h-5 text-indigo-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-100 truncate">
                                        Share {typeLabel}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate">{item.name}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-zinc-600 hover:text-zinc-300 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-5 space-y-5">
                                {/* Visibility selector */}
                                <div>
                                    <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">
                                        Visibility
                                    </p>
                                    <div className="space-y-1.5">
                                        {VISIBILITY_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setVisibility(opt.value)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors border",
                                                    visibility === opt.value
                                                        ? "border-indigo-500/60 bg-indigo-600/10 text-indigo-300"
                                                        : "border-transparent hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                                                )}
                                            >
                                                {opt.icon}
                                                <div>
                                                    <p className="text-xs font-medium">{opt.label}</p>
                                                    <p className="text-[10px] text-zinc-600">{opt.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Role selector */}
                                <div>
                                    <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" /> Permission
                                    </p>
                                    <div className="flex gap-2">
                                        {(["viewer", "editor"] as ShareRole[]).map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRole(r)}
                                                className={cn(
                                                    "flex-1 py-1.5 rounded-md text-xs capitalize transition-colors border",
                                                    role === r
                                                        ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300"
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Share URL */}
                                {visibility !== "private" && shareUrl && (
                                    <div>
                                        <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">
                                            Share link
                                        </p>
                                        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
                                            <span className="flex-1 text-xs text-zinc-400 truncate font-mono">
                                                {shareUrl}
                                            </span>
                                            <CopyButton text={shareUrl} label="Copy" />
                                        </div>
                                    </div>
                                )}

                                {/* JSON manifest */}
                                <div>
                                    <button
                                        onClick={() => setShowManifest((v) => !v)}
                                        className="text-xs text-zinc-500 hover:text-zinc-300 underline"
                                    >
                                        {showManifest ? "Hide" : "Show"} JSON manifest
                                    </button>
                                    <AnimatePresence>
                                        {showManifest && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 relative">
                                                    <pre className="text-[10px] leading-relaxed text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-3 max-h-40 overflow-auto">
                                                        {manifest}
                                                    </pre>
                                                    <div className="absolute top-2 right-2">
                                                        <CopyButton text={manifest} label="Copy JSON" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-3 border-t border-zinc-800 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-1.5 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
