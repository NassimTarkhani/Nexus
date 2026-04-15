"use client";

/**
 * ApiKeysSyncer
 *
 * Headless component mounted once at the root layout.
 * Whenever the user's API keys change in the DB (or on initial load),
 * this syncs them into the in-memory Zustand provider store so every
 * component that reads `useProviderStore().providers[...]` gets the
 * correct key without reading localStorage.
 *
 * This means:
 *  - API keys are NEVER saved to localStorage (store.ts uses partialize)
 *  - On every page load, keys are fetched from the database
 *  - Any component can read from useProviderStore knowing it reflects the DB
 */

import { useEffect } from "react";
import { useApiKeys } from "@/src/lib/hooks/useDatabase";
import { useProviderStore } from "@/src/lib/providers/store";

export function ApiKeysSyncer() {
    const { apiKeys } = useApiKeys();
    const { setProviderConfig } = useProviderStore();

    useEffect(() => {
        for (const key of apiKeys) {
            if (key.enabled) {
                setProviderConfig(key.provider as any, {
                    apiKey: key.api_key,
                    baseURL: key.base_url || undefined,
                    enabled: true,
                });
            }
        }
    }, [apiKeys, setProviderConfig]);

    return null;
}
