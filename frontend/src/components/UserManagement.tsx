"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Users, Plus, Trash2, Edit2, Shield, User as UserIcon, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'user';
    created_at: string;
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({
        full_name: "",
        role: "user" as "admin" | "user",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            full_name: user.full_name,
            role: user.role,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: editForm.full_name,
                    role: editForm.role,
                })
                .eq('id', selectedUser.id);

            if (error) throw error;

            setIsEditOpen(false);
            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            // Delete user from auth.users (will cascade to public.users)
            const { error } = await supabase.auth.admin.deleteUser(userId);

            if (error) throw error;

            fetchUsers();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2">User Management</h3>
                    <p className="text-sm text-zinc-500">Manage user accounts and permissions</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-sm text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Users List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                        All Users ({users.length})
                    </h4>
                </div>

                {users.length === 0 ? (
                    <Card className="bg-zinc-900/30 border-zinc-800">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800 mx-auto flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h4 className="text-lg font-bold text-zinc-300 mb-2">No users found</h4>
                            <p className="text-sm text-zinc-500">
                                Users will appear here once they sign up
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {users.map((user) => (
                            <Card
                                key={user.id}
                                className="group hover:border-indigo-500/30 transition-all"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg",
                                            user.role === 'admin'
                                                ? "bg-purple-600/20 text-purple-400"
                                                : "bg-indigo-600/20 text-indigo-400"
                                        )}>
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="text-sm font-semibold text-zinc-200">
                                                    {user.full_name}
                                                </h5>
                                                {user.role === 'admin' ? (
                                                    <Badge variant="default" className="text-[10px]">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        <UserIcon className="w-3 h-3 mr-1" />
                                                        User
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                            <p className="text-xs text-zinc-600 mt-1">
                                                Joined {new Date(user.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 rounded-lg hover:bg-indigo-600/20 text-zinc-500 hover:text-indigo-400 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 rounded-lg hover:bg-red-600/20 text-zinc-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information and permissions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                value={editForm.full_name}
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as "admin" | "user" })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleUpdate} className="flex-1">
                                Save Changes
                            </Button>
                            <Button onClick={() => setIsEditOpen(false)} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/30">
                <CardHeader>
                    <CardTitle className="text-base">👥 User Management</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-zinc-400 space-y-2">
                    <p>
                        <strong>Admin users</strong> have access to this user management section and can modify user roles.
                    </p>
                    <p>
                        <strong>Regular users</strong> can only access and manage their own data and settings.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
