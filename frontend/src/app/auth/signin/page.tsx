"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Zap, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log('🔄 Attempting sign in for:', email);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('❌ Supabase auth error:', error);

                if (error.message === 'Invalid login credentials') {
                    throw new Error('Invalid email or password. Please check your credentials and try again.');
                } else if (error.message.includes('Email not confirmed')) {
                    throw new Error('Email not confirmed. Run this SQL in Supabase: UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = \'' + email + '\';');
                }
                throw new Error(error.message);
            }

            if (!data.user) {
                throw new Error('Sign in failed - no user returned.');
            }

            console.log('✅ Sign in successful for:', data.user.email);

            // Verify user profile exists
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('id')
                .eq('id', data.user.id)
                .maybeSingle();

            if (profileError) {
                console.error('❌ Profile check error:', profileError);
            }

            if (!profile) {
                console.warn('⚠️ User profile not found, creating...');
                // Try to create profile
                const { error: createError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        email: data.user.email,
                        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
                        role: 'user',
                    });

                if (createError) {
                    console.error('❌ Profile creation failed:', createError);
                    setError('User profile missing. Please contact support.');
                    await supabase.auth.signOut();
                    setLoading(false);
                    return;
                }
                console.log('✅ Profile created');
            }

            console.log('🎉 Sign in complete, redirecting...');
            router.push("/");
            router.refresh();

        } catch (err: any) {
            console.error('❌ Sign in error:', err);
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
                        <Zap className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-100">Welcome to NEXUS</h1>
                    <p className="text-zinc-500 mt-2">Sign in to your account to continue</p>
                </div>

                {/* Sign In Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-sm text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-900 px-2 text-zinc-500">Or</span>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-zinc-500">Don't have an account? </span>
                        <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-zinc-600">
                    By continuing, you agree to NEXUS's Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
