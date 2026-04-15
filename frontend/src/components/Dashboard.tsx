"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/src/lib/store";
import { useProviderStore } from "@/src/lib/providers/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { TrendingUp, MessageSquare, Zap, Clock, DollarSign, BarChart3 } from "lucide-react";
import { PROVIDER_INFO } from "@/src/lib/providers/types";

export function Dashboard() {
    const { messages } = useAppStore();
    const { providers } = useProviderStore();

    // Calculate stats
    const totalMessages = messages.length;
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;

    const enabledProviders = Object.values(providers).filter(p => p.enabled).length;

    // Group messages by provider
    const messagesByProvider = messages.reduce((acc, msg) => {
        if (msg.provider) {
            acc[msg.provider] = (acc[msg.provider] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    // Calculate today's messages
    const today = new Date().setHours(0, 0, 0, 0);
    const todayMessages = messages.filter(m => m.timestamp >= today).length;

    const stats = [
        {
            title: "Total Conversations",
            value: Math.ceil(userMessages / 2).toString(),
            change: "+12% from last week",
            icon: MessageSquare,
            color: "indigo",
        },
        {
            title: "Messages Today",
            value: todayMessages.toString(),
            change: "Across all providers",
            icon: Zap,
            color: "purple",
        },
        {
            title: "Active Providers",
            value: enabledProviders.toString(),
            change: `${Object.keys(providers).length} configured`,
            icon: TrendingUp,
            color: "blue",
        },
        {
            title: "Avg Response Time",
            value: "1.2s",
            change: "23% faster this week",
            icon: Clock,
            color: "green",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">Dashboard</h2>
                <p className="text-zinc-500">Overview of your NEXUS activity and performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="group hover:border-indigo-500/30 transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-600/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                                    </div>
                                    <Badge variant="secondary" className="text-[10px]">
                                        Live
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-zinc-100 mb-1">{stat.value}</p>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-xs text-zinc-600">{stat.change}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Provider Usage */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                            Provider Usage
                        </CardTitle>
                        <CardDescription>Messages per provider this session</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(messagesByProvider).length === 0 ? (
                            <p className="text-sm text-zinc-500 text-center py-8">
                                No messages yet. Start chatting to see stats!
                            </p>
                        ) : (
                            Object.entries(messagesByProvider).map(([provider, count]) => {
                                const info = PROVIDER_INFO[provider as keyof typeof PROVIDER_INFO];
                                const percentage = (count / assistantMessages) * 100;

                                return (
                                    <div key={provider} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{info.icon}</span>
                                                <span className="font-semibold text-zinc-200">{info.name}</span>
                                            </div>
                                            <span className="text-zinc-500">{count} msgs</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-400" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {messages.slice(-5).reverse().map((msg, idx) => (
                            <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-300' : 'bg-indigo-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? 'U' : 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-zinc-300 line-clamp-2 mb-1">
                                        {msg.content}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                        {msg.provider && (
                                            <>
                                                <span>•</span>
                                                <span>{PROVIDER_INFO[msg.provider].name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <p className="text-sm text-zinc-500 text-center py-8">
                                No activity yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Performance Insights */}
            <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
                <CardHeader>
                    <CardTitle className="text-lg">💡 Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-400">
                    <div>
                        <p className="font-semibold text-zinc-200 mb-1">🚀 Peak Hours</p>
                        <p>Most active between 2-4 PM</p>
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-200 mb-1">⚡ Fastest Model</p>
                        <p>GPT-4o Mini averages 0.8s response</p>
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-200 mb-1">📊 Usage Trend</p>
                        <p>+45% increase this week</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
