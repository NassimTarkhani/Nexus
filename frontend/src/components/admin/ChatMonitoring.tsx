"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Calendar, User as UserIcon } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { toast } from "sonner";

interface Conversation {
    id: string;
    user_id: string;
    title: string;
    model_used: string;
    created_at: string;
    message_count: number;
    user_email: string;
}

export function ChatMonitoring() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("conversations")
                .select(`
          *,
          users!conversations_user_id_fkey(email),
          messages(count)
        `)
                .order("created_at", { ascending: false })
                .limit(100);

            if (error) throw error;

            const formatted = (data || []).map((conv: any) => ({
                id: conv.id,
                user_id: conv.user_id,
                title: conv.title,
                model_used: conv.model_used || "Unknown",
                created_at: conv.created_at,
                message_count: conv.messages?.[0]?.count || 0,
                user_email: conv.users?.email || "Unknown",
            }));

            setConversations(formatted);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            toast.error("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <h2 className="text-xl font-semibold text-zinc-100">Chat Monitoring</h2>
                <p className="text-sm text-zinc-500">Monitor all chat conversations across users</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                    placeholder="Search by title or user email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-900 border-zinc-800"
                />
            </div>

            {/* Conversations Table */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Conversation</TableHead>
                            <TableHead className="text-zinc-400">User</TableHead>
                            <TableHead className="text-zinc-400">Model</TableHead>
                            <TableHead className="text-zinc-400">Messages</TableHead>
                            <TableHead className="text-zinc-400">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredConversations.map((conv) => (
                            <TableRow
                                key={conv.id}
                                className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                                onClick={() => setSelectedConversation(conv.id)}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-zinc-200">{conv.title}</div>
                                            <div className="text-xs text-zinc-500">{conv.id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-zinc-500" />
                                        <span className="text-zinc-300">{conv.user_email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="px-2 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded text-xs text-indigo-400 inline-block">
                                        {conv.model_used}
                                    </div>
                                </TableCell>
                                <TableCell className="text-zinc-400">{conv.message_count}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(conv.created_at).toLocaleDateString()}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredConversations.length === 0 && (
                    <div className="py-12 text-center text-zinc-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No conversations found</p>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-2xl font-bold text-zinc-100">{conversations.length}</div>
                    <div className="text-sm text-zinc-500">Total Conversations</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-2xl font-bold text-zinc-100">
                        {conversations.reduce((sum, conv) => sum + conv.message_count, 0)}
                    </div>
                    <div className="text-sm text-zinc-500">Total Messages</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-2xl font-bold text-zinc-100">
                        {new Set(conversations.map((c) => c.user_id)).size}
                    </div>
                    <div className="text-sm text-zinc-500">Active Users</div>
                </div>
            </div>
        </div>
    );
}
