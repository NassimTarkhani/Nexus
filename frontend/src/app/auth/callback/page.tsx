"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Handle the callback from email confirmation
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Auth callback error:', error);
                router.push('/auth/signin?error=callback_failed');
                return;
            }

            if (session) {
                // Email confirmed successfully, redirect to dashboard
                router.push('/');
            } else {
                // No session, redirect to signin
                router.push('/auth/signin');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4" />
                <p className="text-zinc-400">Confirming your email...</p>
            </div>
        </div>
    );
}
