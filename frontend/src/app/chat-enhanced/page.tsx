"use client";

import AuthProvider from "@/src/components/AuthProvider";
import AppShell from "@/src/components/AppShell";

export default function EnhancedChatPage() {
    return (
        <AuthProvider>
            <AppShell initialView="chat" />
        </AuthProvider>
    );
}
