"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, MessageSquare, Activity, Settings, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/src/lib/store";
import { supabase } from "@/src/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { UserManagement } from "@/src/components/admin/UserManagement";
import { ChatMonitoring } from "@/src/components/admin/ChatMonitoring";
import { Analytics } from "@/src/components/admin/Analytics";

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminAccess();
    }, [user]);

    const checkAdminAccess = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        try {
            // Check if user has admin role
            const { data, error } = await supabase
                .from("users")
                .select("role")
                .eq("id", user.id)
                .single();

            if (error || data?.role !== "admin") {
                router.push("/");
                return;
            }

            setIsAdmin(true);
        } catch (error) {
            console.error("Admin check failed:", error);
            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100">Admin Dashboard</h1>
                            <p className="text-sm text-zinc-500">Manage users, monitor activity, and view analytics</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-xs text-indigo-400 font-medium">
                                Admin Access
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="chats" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Chat Monitoring
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-6">
                        <UserManagement />
                    </TabsContent>

                    <TabsContent value="chats" className="space-y-6">
                        <ChatMonitoring />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <Analytics />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
