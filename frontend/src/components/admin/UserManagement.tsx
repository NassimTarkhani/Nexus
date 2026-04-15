"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit2, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
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

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            setUsers(data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const toggleUserRole = async (userId: string, currentRole: string) => {
        try {
            const newRole = currentRole === "admin" ? "user" : "admin";

            const { error } = await supabase
                .from("users")
                .update({ role: newRole })
                .eq("id", userId);

            if (error) throw error;

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );

            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Failed to update role:", error);
            toast.error("Failed to update user role");
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("users")
                .delete()
                .eq("id", userId);

            if (error) throw error;

            setUsers((prev) => prev.filter((user) => user.id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error("Failed to delete user");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-100">User Management</h2>
                    <p className="text-sm text-zinc-500">Manage user accounts and permissions</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                    placeholder="Search users by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinc-900 border-zinc-800"
                />
            </div>

            {/* Users Table */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">User</TableHead>
                            <TableHead className="text-zinc-400">Email</TableHead>
                            <TableHead className="text-zinc-400">Role</TableHead>
                            <TableHead className="text-zinc-400">Joined</TableHead>
                            <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-zinc-200">
                                                {user.full_name || "Anonymous"}
                                            </div>
                                            <div className="text-xs text-zinc-500">{user.id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-zinc-300">{user.email}</TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => toggleUserRole(user.id, user.role)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.role === "admin"
                                            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 hover:bg-indigo-600/20"
                                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                                            }`}
                                    >
                                        {user.role === "admin" ? (
                                            <div className="flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                Admin
                                            </div>
                                        ) : (
                                            "User"
                                        )}
                                    </button>
                                </TableCell>
                                <TableCell className="text-zinc-400">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-zinc-800"
                                        >
                                            <Edit2 className="w-4 h-4 text-zinc-400" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteUser(user.id)}
                                            className="h-8 w-8 p-0 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-zinc-500">
                        <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No users found</p>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-2xl font-bold text-zinc-100">{users.length}</div>
                    <div className="text-sm text-zinc-500">Total Users</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-2xl font-bold text-zinc-100">
                        {users.filter((u) => u.role === "admin").length}
                    </div>
                    <div className="text-sm text-zinc-500">Administrators</div>
                </div>
                <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-2xl font-bold text-zinc-100">
                        {users.filter((u) => u.role === "user").length}
                    </div>
                    <div className="text-sm text-zinc-500">Regular Users</div>
                </div>
            </div>
        </div>
    );
}
