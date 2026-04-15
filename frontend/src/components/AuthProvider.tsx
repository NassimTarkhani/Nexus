"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/lib/store";
import { Loader2 } from "lucide-react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading, initialized, initAuth } = useAuthStore();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    useEffect(() => {
        if (initialized && !loading && !user) {
            router.push("/auth/signin");
        }
    }, [initialized, loading, user, router]);

    if (!initialized || loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
                    <p className="text-zinc-500">Loading NEXUS...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
