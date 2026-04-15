import { supabase } from "../supabase";

export interface Preset {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    system_prompt: string;
    temperature?: number;
    max_tokens?: number;
    preferred_model?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePresetData {
    name: string;
    description?: string;
    system_prompt: string;
    temperature?: number;
    max_tokens?: number;
    preferred_model?: string;
}

export interface UpdatePresetData extends Partial<CreatePresetData> { }

/**
 * Get all presets for the current user
 */
export async function getPresets(): Promise<Preset[]> {
    try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            console.log("No active session, returning empty presets");
            return [];
        }

        const { data, error } = await supabase
            .from("user_presets")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            // Table might not exist yet
            if (error.message?.includes("does not exist") || 
                error.code === '42P01' || 
                error.message?.includes("relation") ||
                error.message?.includes("user_presets")) {
                console.warn("⚠️ user_presets table not found. Run DATABASE_UPGRADE.sql in Supabase to enable presets.");
                return [];
            }
            console.error("Error fetching presets:", error.message || error);
            return []; // Don't throw, just return empty array
        }

        return data || [];
    } catch (err) {
        console.error("Unexpected error in getPresets:", err);
        return [];
    }
}

/**
 * Get a single preset by ID
 */
export async function getPreset(id: string): Promise<Preset | null> {
    const { data, error } = await supabase
        .from("user_presets")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching preset:", error);
        throw error;
    }

    return data;
}

/**
 * Create a new preset
 */
export async function createPreset(
    userId: string,
    presetData: CreatePresetData
): Promise<Preset> {
    const { data, error } = await supabase
        .from("user_presets")
        .insert({
            user_id: userId,
            ...presetData,
        })
        .select()
        .single();

    if (error) {
        // Provide helpful error message if table doesn't exist
        if (error.message?.includes("does not exist") || 
            error.code === '42P01' ||
            error.message?.includes("relation") ||
            error.message?.includes("user_presets")) {
            throw new Error("⚠️ user_presets table not found.\n\nTo enable presets:\n1. Go to Supabase Dashboard\n2. Open SQL Editor\n3. Run DATABASE_UPGRADE.sql");
        }
        console.error("Error creating preset:", error);
        throw error;
    }

    return data;
}

/**
 * Update an existing preset
 */
export async function updatePreset(
    id: string,
    updates: UpdatePresetData
): Promise<Preset> {
    const { data, error } = await supabase
        .from("user_presets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating preset:", error);
        throw error;
    }

    return data;
}

/**
 * Delete a preset
 */
export async function deletePreset(id: string): Promise<void> {
    const { error } = await supabase
        .from("user_presets")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting preset:", error);
        throw error;
    }
}

/**
 * Duplicate a preset
 */
export async function duplicatePreset(
    id: string,
    userId: string
): Promise<Preset> {
    const original = await getPreset(id);
    if (!original) {
        throw new Error("Preset not found");
    }

    return createPreset(userId, {
        name: `${original.name} (Copy)`,
        description: original.description,
        system_prompt: original.system_prompt,
        temperature: original.temperature || undefined,
        max_tokens: original.max_tokens || undefined,
        preferred_model: original.preferred_model || undefined,
    });
}
