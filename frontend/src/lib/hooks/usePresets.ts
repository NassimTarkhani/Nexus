"use client";

import { useState, useEffect } from "react";
import {
    getPresets,
    getPreset,
    createPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    type Preset,
    type CreatePresetData,
    type UpdatePresetData,
} from "../services/presets";
import { useAuthStore } from "../store";

export function usePresets() {
    const { user } = useAuthStore();
    const [presets, setPresets] = useState<Preset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPresets = async () => {
        // Don't fetch if user is not logged in
        if (!user) {
            setPresets([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getPresets();
            setPresets(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch presets:", err);
            setError(err as Error);
            setPresets([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresets();
    }, [user?.id]); // Re-fetch when user changes

    const create = async (userId: string, data: CreatePresetData) => {
        const newPreset = await createPreset(userId, data);
        setPresets((prev) => [newPreset, ...prev]);
        return newPreset;
    };

    const update = async (id: string, data: UpdatePresetData) => {
        const updatedPreset = await updatePreset(id, data);
        setPresets((prev) =>
            prev.map((p) => (p.id === id ? updatedPreset : p))
        );
        return updatedPreset;
    };

    const remove = async (id: string) => {
        await deletePreset(id);
        setPresets((prev) => prev.filter((p) => p.id !== id));
    };

    const duplicate = async (id: string, userId: string) => {
        const duplicatedPreset = await duplicatePreset(id, userId);
        setPresets((prev) => [duplicatedPreset, ...prev]);
        return duplicatedPreset;
    };

    return {
        presets,
        loading,
        error,
        create,
        update,
        remove,
        duplicate,
        refresh: fetchPresets,
    };
}

export function usePreset(id: string | null) {
    const [preset, setPreset] = useState<Preset | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setPreset(null);
            setLoading(false);
            return;
        }

        const fetchPreset = async () => {
            try {
                setLoading(true);
                const data = await getPreset(id);
                setPreset(data);
                setError(null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreset();
    }, [id]);

    return { preset, loading, error };
}
