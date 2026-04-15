"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/lib/store";

/**
 * Mounts in the root layout and calls initAuth() once on startup.
 * This ensures the Supabase session is resolved before any page renders.
 */
export default function AuthInitializer() {
    const initAuth = useAuthStore((s) => s.initAuth);
    useEffect(() => {
        initAuth();
    }, [initAuth]);
    return null;
}
