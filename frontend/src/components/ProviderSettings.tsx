"use client";

import { useEffect, useState } from "react";
import { useProviderStore } from "@/src/lib/providers/store";
import { PROVIDER_INFO, AVAILABLE_MODELS, type LLMProvider } from "@/src/lib/providers/types";
import { supabase } from "@/src/lib/supabase";
import { useApiKeys } from "@/src/lib/hooks/useDatabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Switch } from "@/src/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Eye, EyeOff, ExternalLink, Check, Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function ProviderSettings() {
    const { setProviderConfig, deleteProvider } = useProviderStore();
    const { apiKeys, refresh: refreshApiKeys, deleteApiKey, toggleApiKey } = useApiKeys();
    const [showApiKeys, setShowApiKeys] = useState<Record<LLMProvider, boolean>>({} as Record<LLMProvider, boolean>);
    const [editingProvider, setEditingProvider] = useState<LLMProvider | null>(null);
    const [tempApiKey, setTempApiKey] = useState("");
    const [tempBaseURL, setTempBaseURL] = useState("");
    const [savingProvider, setSavingProvider] = useState<LLMProvider | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        for (const key of apiKeys) {
            if (key.provider === 'openrouter') {
                setProviderConfig(key.provider as LLMProvider, {
                    apiKey: key.api_key,
                    baseURL: key.base_url || undefined,
                    enabled: key.enabled,
                });
            }
        }
    }, [apiKeys, setProviderConfig]);

    const handleSaveProvider = async () => {
        if (!editingProvider || !tempApiKey.trim()) return;

        setSavingProvider(editingProvider);
        setSaveError(null);

        try {
            // Get a fresh session — auto-refreshes expired tokens
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error("Not signed in. Please sign in and try again.");
            }

            // Write directly to Supabase — bypasses hook layer, guarantees auth context
            const { error: dbError } = await supabase
                .from('user_api_keys')
                .upsert(
                    {
                        user_id: session.user.id,
                        provider: editingProvider,
                        api_key: tempApiKey.trim(),
                        base_url: tempBaseURL.trim() || null,
                        enabled: true,
                    },
                    { onConflict: 'user_id,provider' }
                );

            if (dbError) throw dbError;

            // Sync into in-memory store so the rest of the UI sees the key immediately
            setProviderConfig(editingProvider, {
                apiKey: tempApiKey,
                baseURL: tempBaseURL || undefined,
                enabled: true,
            });

            // Refresh the hook's local list in the background
            refreshApiKeys();

            toast.success("API key saved", {
                description: `${PROVIDER_INFO[editingProvider].name} key saved to database.`,
            });

            setEditingProvider(null);
            setTempApiKey("");
            setTempBaseURL("");
        } catch (error: any) {
            console.error("Failed to save provider key:", error);
            const msg = error?.message || "Could not save API key";
            setSaveError(msg);
            toast.error("Failed to save", { description: msg });
        } finally {
            setSavingProvider(null);
        }
    };

    const handleEditProvider = (provider: LLMProvider) => {
        setEditingProvider(provider);
        const dbKey = apiKeys.find((k) => k.provider === provider);
        setTempApiKey(dbKey?.api_key || "");
        setTempBaseURL(dbKey?.base_url || "");
    };

    const toggleApiKeyVisibility = (provider: LLMProvider) => {
        setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
    };

    const handleToggleProvider = async (provider: LLMProvider, enabled: boolean) => {
        try {
            setProviderConfig(provider, { enabled });
            const record = apiKeys.find((k) => k.provider === provider);
            if (record) {
                await toggleApiKey(record.id, enabled);
            }
        } catch (error: any) {
            console.error("Failed to toggle provider:", error);
            toast.error("Failed to update provider", {
                description: error?.message || "Could not update provider status",
            });
            setProviderConfig(provider, { enabled: !enabled });
        }
    };

    const handleRemoveProvider = async (provider: LLMProvider) => {
        try {
            const record = apiKeys.find((k) => k.provider === provider);
            if (record) {
                await deleteApiKey(record.id);
            }
            deleteProvider(provider);
            setEditingProvider(null);
            toast.success(`${PROVIDER_INFO[provider].name} removed`);
        } catch (error: any) {
            console.error("Failed to remove provider:", error);
            toast.error("Failed to remove provider", {
                description: error?.message || "Could not remove provider",
            });
        }
    };

    const providerList: LLMProvider[] = ['openrouter'];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">OpenRouter Provider</h3>
                <p className="text-sm text-zinc-500">Configure your OpenRouter API key for all model access</p>
            </div>

            <div className="grid gap-4">
                {providerList.map((provider) => {
                    const info = PROVIDER_INFO[provider];
                    const dbKey = apiKeys.find((k) => k.provider === provider);
                    const isConfigured = !!dbKey;
                    const models = AVAILABLE_MODELS[provider];

                    return (
                        <Card key={provider} className="group hover:border-indigo-500/30 transition-all">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl">
                                            {info.icon}
                                        </div>
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {info.name}
                                                {isConfigured && (
                                                    <Badge variant="success" className="text-[10px]">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        CONFIGURED
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription>{info.description}</CardDescription>
                                        </div>
                                    </div>

                                    {isConfigured && (
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={dbKey?.enabled ?? true}
                                                onCheckedChange={(enabled) => handleToggleProvider(provider, enabled)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {isConfigured ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-zinc-500">API Key</Label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 relative">
                                                    <Input
                                                        type={showApiKeys[provider] ? "text" : "password"}
                                                        value={dbKey?.api_key ?? ""}
                                                        disabled
                                                        className="font-mono text-xs pr-10"
                                                    />
                                                    <button
                                                        onClick={() => toggleApiKeyVisibility(provider)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800 rounded transition-colors"
                                                    >
                                                        {showApiKeys[provider] ? (
                                                            <EyeOff className="w-4 h-4 text-zinc-500" />
                                                        ) : (
                                                            <Eye className="w-4 h-4 text-zinc-500" />
                                                        )}
                                                    </button>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => handleEditProvider(provider)}>
                                                            Edit
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit {info.name} Configuration</DialogTitle>
                                                            <DialogDescription>
                                                                Update your API key and settings
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            {saveError && (
                                                                <p className="text-xs text-red-400">{saveError}</p>
                                                            )}
                                                            <div className="space-y-2">
                                                                <Label>API Key *</Label>
                                                                <Input
                                                                    value={tempApiKey}
                                                                    onChange={(e) => setTempApiKey(e.target.value)}
                                                                    placeholder="sk-..."
                                                                    type="password"
                                                                />
                                                            </div>
                                                            {provider === 'openrouter' && (
                                                                <div className="space-y-2">
                                                                    <Label>Base URL (Optional)</Label>
                                                                    <Input
                                                                        value={tempBaseURL}
                                                                        onChange={(e) => setTempBaseURL(e.target.value)}
                                                                        placeholder="https://"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex gap-2 justify-end">
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveProvider(provider)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Remove
                                                                </Button>
                                                                <Button onClick={handleSaveProvider} disabled={savingProvider === provider}>
                                                                    Save Changes
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs text-zinc-500 mb-2 block">Available Models ({models.length})</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {models.slice(0, 3).map((model) => (
                                                    <Badge key={model.id} variant="secondary" className="text-[10px]">
                                                        {model.name}
                                                    </Badge>
                                                ))}
                                                {models.length > 3 && (
                                                    <Badge variant="outline" className="text-[10px]">
                                                        +{models.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" onClick={() => handleEditProvider(provider)}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Configure {info.name}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <span className="text-2xl">{info.icon}</span>
                                                    Configure {info.name}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Add your API key to start using {info.name} models
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                {saveError && (
                                                    <p className="text-xs text-red-400">{saveError}</p>
                                                )}
                                                <div className="space-y-2">
                                                    <Label>API Key *</Label>
                                                    <Input
                                                        value={tempApiKey}
                                                        onChange={(e) => setTempApiKey(e.target.value)}
                                                        placeholder="sk-..."
                                                        type="password"
                                                    />
                                                    <a
                                                        href={info.signupUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                                    >
                                                        Get API Key
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                                {provider === 'openrouter' && (
                                                    <div className="space-y-2">
                                                        <Label>Base URL (Optional)</Label>
                                                        <Input
                                                            value={tempBaseURL}
                                                            onChange={(e) => setTempBaseURL(e.target.value)}
                                                            placeholder='https://openrouter.ai/api/v1'
                                                        />
                                                    </div>
                                                )}
                                                <Button className="w-full" onClick={handleSaveProvider} disabled={!tempApiKey.trim() || savingProvider === provider}>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    {savingProvider === provider ? "Saving..." : "Save & Enable"}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

        </div>
    );
}
