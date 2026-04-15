"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Zap, Mail, Lock, User, AlertCircle, Loader2, CheckCircle } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (!fullName.trim()) {
            setError("Please enter your full name");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            console.log('🔄 Starting signup for:', email);

            // Step 1: Create user in Supabase auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: "user",
                    }
                }
            });

            if (error) {
                console.error('❌ Signup error:', error);
                if (error.message.includes('already registered') || error.message.includes('User already registered')) {
                    throw new Error('This email is already registered. Please sign in instead.');
                }
                throw new Error(error.message);
            }

            console.log('✅ Signup response:', {
                userId: data.user?.id,
                email: data.user?.email,
                hasSession: !!data.session,
                emailConfirmed: data.user?.email_confirmed_at
            });

            // Check if user was actually created
            if (!data.user) {
                throw new Error('Signup failed - no user returned. Please check Supabase settings.');
            }

            // Check if email confirmation is blocking
            if (!data.session && !data.user.email_confirmed_at) {
                console.warn('⚠️ User created but needs email confirmation');
                throw new Error('Email confirmation is required. Please check your inbox or disable email confirmations in Supabase Dashboard (Authentication → Settings).');
            }

            console.log('🔄 Creating user profile...');

            // Step 2: Create profile in public.users
            // First check if profile already exists
            const { data: existingProfile } = await supabase
                .from('users')
                .select('id')
                .eq('id', data.user.id)
                .maybeSingle();

            if (!existingProfile) {
                // Create profile
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        email: email,
                        full_name: fullName,
                        role: 'user',
                    });

                if (profileError) {
                    console.error('❌ Profile creation failed:', profileError);
                    throw new Error(`Failed to create user profile: ${profileError.message}`);
                }

                console.log('✅ User profile created');

                // Create default preferences
                const { error: prefsError } = await supabase
                    .from('user_preferences')
                    .insert({
                        user_id: data.user.id,
                    });

                if (prefsError) {
                    console.warn('⚠️ Preferences creation failed:', prefsError.message);
                    // Non-critical, continue anyway
                } else {
                    console.log('✅ User preferences created');
                }
            } else {
                console.log('✅ User profile already exists');
            }

            console.log('🎉 Signup complete!');
            setSuccess(true);

            // Redirect to dashboard
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 2000);

        } catch (err: any) {
            console.error('❌ Sign up error:', err);
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-600/20 border border-green-600/30 mb-4">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-100">Account Created!</h2>
                    <p className="text-zinc-400">
                        Welcome to NEXUS. Redirecting you to the dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
                        <Zap className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-100">Join NEXUS</h1>
                    <p className="text-zinc-500 mt-2">Create your account to get started</p>
                </div>

                {/* Sign Up Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-sm text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-zinc-800 border-zinc-700"
                            />
                        </div>

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
                            <p className="text-xs text-zinc-500">At least 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
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
                        <span className="text-zinc-500">Already have an account? </span>
                        <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign in
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
