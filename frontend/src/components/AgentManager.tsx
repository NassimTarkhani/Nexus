"use client";

import { useState } from "react";
import { useAgentStore, type Agent } from "@/src/lib/agentStore";
import { useProviderStore } from "@/src/lib/providers/store";
import { AVAILABLE_MODELS, PROVIDER_INFO, type LLMProvider } from "@/src/lib/providers/types";
import { DEFAULT_MODEL } from "@/src/lib/models/openrouter";
import { tools } from "@/src/lib/mocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Plus, Trash2, Edit, Sparkles, Users, Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function AgentManager() {
    const { agents, createAgent, updateAgent, deleteAgent, selectedAgent, setSelectedAgent } = useAgentStore();
    const { providers, getEnabledProviders } = useProviderStore();
    const [isCreating, setIsCreating] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        systemPrompt: "",
        provider: "openrouter" as LLMProvider,
        model: DEFAULT_MODEL.model,
        tools: [] as string[],
        temperature: 0.7,
    });

    const enabledProviders = getEnabledProviders();
    const hasProviders = enabledProviders.length > 0;

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            systemPrompt: "",
            provider: "openrouter",
            model: DEFAULT_MODEL.model,
            tools: [],
            temperature: 0.7,
        });
    };

    const handleCreate = () => {
        if (!formData.name.trim() || !formData.systemPrompt.trim()) return;

        createAgent(formData);
        setIsCreating(false);
        resetForm();
    };

    const handleUpdate = () => {
        if (!editingAgent) return;

        updateAgent(editingAgent.id, formData);
        setEditingAgent(null);
        resetForm();
    };

    const handleEdit = (agent: Agent) => {
        setEditingAgent(agent);
        setFormData({
            name: agent.name,
            description: agent.description,
            systemPrompt: agent.systemPrompt,
            provider: agent.provider,
            model: agent.model,
            tools: agent.tools,
            temperature: agent.temperature,
        });
    };

    const toggleTool = (toolId: string) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.includes(toolId)
                ? prev.tools.filter(t => t !== toolId)
                : [...prev.tools, toolId],
        }));
    };

    const availableModels = AVAILABLE_MODELS[formData.provider] || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">AI Agents</h3>
                    <p className="text-sm text-zinc-500">Create specialized agents with custom instructions and tools</p>
                </div>

                <Dialog open={isCreating || !!editingAgent} onOpenChange={(open) => {
                    setIsCreating(open && !editingAgent);
                    if (!open) {
                        setEditingAgent(null);
                        resetForm();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsCreating(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Agent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingAgent ? 'Edit Agent' : 'Create New Agent'}</DialogTitle>
                            <DialogDescription>
                                Configure an AI agent with specific instructions and capabilities
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Basic Info */}
                            <div className="space-y-2">
                                <Label>Name *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Research Assistant"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the agent's purpose"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>System Prompt *</Label>
                                <textarea
                                    value={formData.systemPrompt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                                    placeholder="You are an expert assistant that..."
                                    className="w-full min-h-[120px] rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                    rows={5}
                                />
                                <p className="text-xs text-zinc-500">Define the agent's role, expertise, and behavior</p>
                            </div>

                            {/* Provider & Model */}
                            {hasProviders ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Provider</Label>
                                            <select
                                                value={formData.provider}
                                                onChange={(e) => {
                                                    const provider = e.target.value as LLMProvider;
                                                    const models = AVAILABLE_MODELS[provider];
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        provider,
                                                        model: models[0]?.id || prev.model,
                                                    }));
                                                }}
                                                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-zinc-100 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            >
                                                {enabledProviders.map((p) => (
                                                    <option key={p.provider} value={p.provider}>
                                                        {PROVIDER_INFO[p.provider].name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Model</Label>
                                            <select
                                                value={formData.model}
                                                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                                className="w-full h-10 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-zinc-100 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                            >
                                                {availableModels.map((model) => (
                                                    <option key={model.id} value={model.id}>
                                                        {model.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Temperature: {formData.temperature.toFixed(1)}</Label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="2"
                                            step="0.1"
                                            value={formData.temperature}
                                            onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                            className="w-full"
                                        />
                                        <p className="text-xs text-zinc-500">
                                            Lower = more focused, Higher = more creative
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <Card className="bg-yellow-600/10 border-yellow-600/30">
                                    <CardContent className="p-4">
                                        <p className="text-sm text-yellow-400">
                                            Configure at least one provider in Settings to create agents
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Tools */}
                            <div className="space-y-2">
                                <Label>Available Tools</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {tools.map((tool) => (
                                        <button
                                            key={tool.id}
                                            onClick={() => toggleTool(tool.id)}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                                                formData.tools.includes(tool.id)
                                                    ? "border-indigo-500 bg-indigo-600/10"
                                                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded border flex items-center justify-center",
                                                formData.tools.includes(tool.id)
                                                    ? "border-indigo-500 bg-indigo-600"
                                                    : "border-zinc-700"
                                            )}>
                                                {formData.tools.includes(tool.id) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-200 truncate">{tool.name}</p>
                                                <p className="text-xs text-zinc-500 truncate">{tool.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end pt-4">
                                {editingAgent && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            deleteAgent(editingAgent.id);
                                            setEditingAgent(null);
                                            resetForm();
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    onClick={editingAgent ? handleUpdate : handleCreate}
                                    disabled={!formData.name.trim() || !formData.systemPrompt.trim() || !hasProviders}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {editingAgent ? 'Update Agent' : 'Create Agent'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => {
                    const providerInfo = PROVIDER_INFO[agent.provider];
                    const isSelected = selectedAgent === agent.id;

                    return (
                        <Card
                            key={agent.id}
                            className={cn(
                                "group cursor-pointer transition-all",
                                isSelected ? "border-indigo-500 bg-indigo-600/5" : "hover:border-indigo-500/30"
                            )}
                            onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justifycenter text-2xl group-hover:scale-110 transition-transform">
                                            {providerInfo.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base truncate">{agent.name}</CardTitle>
                                            {agent.description && (
                                                <CardDescription className="text-xs truncate">{agent.description}</CardDescription>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(agent);
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary" className="text-[10px]">
                                        {AVAILABLE_MODELS[agent.provider]?.find(m => m.id === agent.model)?.name || agent.model}
                                    </Badge>
                                    {agent.tools.map((toolId) => {
                                        const tool = tools.find(t => t.id === toolId);
                                        return tool ? (
                                            <Badge key={toolId} variant="outline" className="text-[10px]">
                                                {tool.name}
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                                <p className="text-xs text-zinc-500 line-clamp-2">
                                    {agent.systemPrompt}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {agents.length === 0 && (
                <Card className="bg-zinc-900/30 border-zinc-800">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-300 mb-2">No agents yet</h3>
                        <p className="text-sm text-zinc-500 mb-4">
                            Create your first AI agent to get started
                        </p>
                        <Button onClick={() => setIsCreating(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Agent
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
