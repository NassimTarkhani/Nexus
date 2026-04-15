"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, MessageSquare, Zap } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface AnalyticsData {
    totalUsers: number;
    totalConversations: number;
    totalMessages: number;
    activeToday: number;
    popularModel: string;
    modelUsage: Record<string, number>;
}

export function Analytics() {
    const [data, setData] = useState<AnalyticsData>({
        totalUsers: 0,
        totalConversations: 0,
        totalMessages: 0,
        activeToday: 0,
        popularModel: "Unknown",
        modelUsage: {},
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            // Fetch total users
            const { count: userCount } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true });

            // Fetch total conversations
            const { count: convCount } = await supabase
                .from("conversations")
                .select("*", { count: "exact", head: true });

            // Fetch total messages
            const { count: msgCount } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true });

            // Fetch conversations today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: todayCount } = await supabase
                .from("conversations")
                .select("*", { count: "exact", head: true })
                .gte("created_at", today.toISOString());

            // Fetch model usage
            const { data: conversations } = await supabase
                .from("conversations")
                .select("model_used");

            const modelUsage: Record<string, number> = {};
            conversations?.forEach((conv) => {
                const model = conv.model_used || "Unknown";
                modelUsage[model] = (modelUsage[model] || 0) + 1;
            });

            const popularModel = Object.entries(modelUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

            setData({
                totalUsers: userCount || 0,
                totalConversations: convCount || 0,
                totalMessages: msgCount || 0,
                activeToday: todayCount || 0,
                popularModel,
                modelUsage,
            });
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-zinc-100">Analytics</h2>
                <p className="text-sm text-zinc-500">Platform usage statistics and insights</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="w-6 h-6" />}
                    label="Total Users"
                    value={data.totalUsers}
                    color="indigo"
                />
                <StatCard
                    icon={<MessageSquare className="w-6 h-6" />}
                    label="Conversations"
                    value={data.totalConversations}
                    color="emerald"
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Messages Sent"
                    value={data.totalMessages}
                    color="purple"
                />
                <StatCard
                    icon={<Zap className="w-6 h-6" />}
                    label="Active Today"
                    value={data.activeToday}
                    color="blue"
                />
            </div>

            {/* Model Usage */}
            <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Model Usage</h3>
                <div className="space-y-3">
                    {Object.entries(data.modelUsage)
                        .sort((a, b) => b[1] - a[1])
                        .map(([model, count]) => {
                            const percentage = (count / data.totalConversations) * 100;
                            return (
                                <div key={model} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-300">{model}</span>
                                        <span className="text-zinc-500">
                                            {count} ({percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                    {Object.keys(data.modelUsage).length === 0 && (
                        <p className="text-center text-zinc-500 py-8">No model usage data available</p>
                    )}
                </div>
            </div>

            {/* Popular Model Card */}
            <div className="border border-zinc-800 rounded-lg p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-sm text-zinc-400">Most Popular Model</div>
                        <div className="text-2xl font-bold text-zinc-100">{data.popularModel}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: "indigo" | "emerald" | "purple" | "blue";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    const colorClasses = {
        indigo: "from-indigo-600 to-indigo-700",
        emerald: "from-emerald-600 to-emerald-700",
        purple: "from-purple-600 to-purple-700",
        blue: "from-blue-600 to-blue-700",
    };

    return (
        <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50">
            <div className="flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}
                >
                    {icon}
                </div>
                <div>
                    <div className="text-sm text-zinc-400">{label}</div>
                    <div className="text-2xl font-bold text-zinc-100">{value.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
