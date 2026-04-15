"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Plus, Server, Trash2, Check, X, RefreshCw, Plug, Wrench, FileText } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface MCPServer {
    id: string;
    name: string;
    url: string;
    status: 'connected' | 'disconnected' | 'error';
    tools: number;
    resources: number;
    description: string;
}

export function MCPSettings() {
    const [servers, setServers] = useState<MCPServer[]>([
        {
            id: '1',
            name: 'Workflow Engine',
            url: 'http://localhost:8000/mcp',
            status: 'connected',
            tools: 3,
            resources: 5,
            description: 'Execute and manage NEXUS workflows'
        },
        {
            id: '2',
            name: 'Knowledge Base',
            url: 'http://localhost:8000/rag',
            status: 'connected',
            tools: 2,
            resources: 12,
            description: 'Search and retrieve documents with RAG'
        },
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
    });

    const handleAdd = () => {
        if (!formData.name || !formData.url) return;

        const newServer: MCPServer = {
            id: Date.now().toString(),
            name: formData.name,
            url: formData.url,
            description: formData.description,
            status: 'disconnected',
            tools: 0,
            resources: 0,
        };

        setServers([...servers, newServer]);
        setFormData({ name: '', url: '', description: '' });
        setIsOpen(false);

        // Simulate connection
        setTimeout(() => {
            setServers(prev => prev.map(s =>
                s.id === newServer.id ? { ...s, status: 'connected', tools: Math.floor(Math.random() * 5) + 1, resources: Math.floor(Math.random() * 10) + 1 } : s
            ));
        }, 1500);
    };

    const handleDelete = (id: string) => {
        setServers(servers.filter(s => s.id !== id));
    };

    const handleRefresh = (id: string) => {
        setServers(prev => prev.map(s =>
            s.id === id ? { ...s, status: 'disconnected' } : s
        ));

        setTimeout(() => {
            setServers(prev => prev.map(s =>
                s.id === id ? { ...s, status: 'connected' } : s
            ));
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">MCP Servers</h3>
                    <p className="text-sm text-zinc-500">Connect to Model Context Protocol servers for extended capabilities</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Server
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add MCP Server</DialogTitle>
                            <DialogDescription>
                                Connect to a new MCP server to extend NEXUS capabilities
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Server Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="My MCP Server"
                                />
                            </div>
                            <div>
                                <Label htmlFor="url">Server URL</Label>
                                <Input
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="http://localhost:8000/mcp"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What does this server provide?"
                                />
                            </div>
                            <Button onClick={handleAdd} className="w-full">
                                Connect Server
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Server List */}
            <div className="space-y-4">
                {servers.map((server) => (
                    <Card key={server.id} className="group hover:border-indigo-500/30 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                    server.status === 'connected' ? "bg-indigo-600/20 text-indigo-400" :
                                        server.status === 'error' ? "bg-red-600/20 text-red-400" :
                                            "bg-zinc-800 text-zinc-500"
                                )}>
                                    <Server className="w-6 h-6" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <h4 className="text-lg font-bold text-zinc-200 mb-1">{server.name}</h4>
                                            <p className="text-xs text-zinc-500 mb-2">{server.description}</p>
                                            <code className="text-xs text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded">
                                                {server.url}
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {server.status === 'connected' && (
                                                <Badge variant="success" className="text-[10px]">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Connected
                                                </Badge>
                                            )}
                                            {server.status === 'disconnected' && (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    Disconnected
                                                </Badge>
                                            )}
                                            {server.status === 'error' && (
                                                <Badge variant="destructive" className="text-[10px]">
                                                    <X className="w-3 h-3 mr-1" />
                                                    Error
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Wrench className="w-4 h-4 text-zinc-600" />
                                            <span className="text-zinc-400">{server.tools} tools</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4 text-zinc-600" />
                                            <span className="text-zinc-400">{server.resources} resources</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRefresh(server.id)}
                                            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors flex items-center gap-2"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Refresh
                                        </button>
                                        <button
                                            onClick={() => handleDelete(server.id)}
                                            className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {servers.length === 0 && (
                    <Card className="bg-zinc-900/30 border-zinc-800">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                                <Server className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h4 className="text-lg font-bold text-zinc-300 mb-2">No MCP Servers</h4>
                            <p className="text-sm text-zinc-500 mb-4">
                                Connect to MCP servers to extend NEXUS with custom tools and resources
                            </p>
                            <Button onClick={() => setIsOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Server
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Plug className="w-5 h-5 text-indigo-400" />
                        About MCP
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-400 space-y-2">
                    <p>
                        <strong>Model Context Protocol (MCP)</strong> is an open standard for connecting AI models to external tools and data sources.
                    </p>
                    <p className="mt-2">
                        NEXUS MCP servers provide:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>execute_workflow</strong> - Run automated workflows</li>
                        <li><strong>search_knowledge_base</strong> - Query RAG documents</li>
                        <li><strong>Custom Tools</strong> - Any tool your server exposes</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
