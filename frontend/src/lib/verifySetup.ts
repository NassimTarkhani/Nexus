// Database setup verification utility
import { supabase } from './supabase';

export interface SetupStatus {
    connected: boolean;
    tablesExist: boolean;
    triggerExists: boolean;
    rlsPoliciesExist: boolean;
    errors: string[];
    warnings: string[];
}

export async function verifyDatabaseSetup(): Promise<SetupStatus> {
    const status: SetupStatus = {
        connected: false,
        tablesExist: false,
        triggerExists: false,
        rlsPoliciesExist: false,
        errors: [],
        warnings: [],
    };

    try {
        // Test connection
        const { error: connectionError } = await supabase.from('users').select('count', { count: 'exact', head: true });

        if (connectionError) {
            if (connectionError.code === '42P01') {
                status.errors.push('Database tables not found. Please run DATABASE_SCHEMA.sql in Supabase SQL Editor.');
                return status;
            }
            status.errors.push(`Connection error: ${connectionError.message}`);
            return status;
        }

        status.connected = true;

        // Check if all required tables exist
        const requiredTables = [
            'users',
            'user_preferences',
            'user_api_keys',
            'user_agents',
            'user_workflows',
            'user_mcp_servers',
            'conversations',
            'messages',
        ];

        const tableChecks = await Promise.all(
            requiredTables.map(async (table) => {
                const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
                return { table, exists: !error };
            })
        );

        const missingTables = tableChecks.filter(t => !t.exists).map(t => t.table);

        if (missingTables.length > 0) {
            status.errors.push(`Missing tables: ${missingTables.join(', ')}`);
            status.warnings.push('Run DATABASE_SCHEMA.sql in Supabase SQL Editor to create missing tables.');
        } else {
            status.tablesExist = true;
        }

        // Check RLS policies (try to query without auth)
        // If this works, RLS might not be enabled
        const { data, error } = await supabase.from('users').select('*').limit(1);

        if (!error && data && data.length > 0) {
            status.warnings.push('RLS policies may not be properly configured. Users table is publicly readable.');
        } else {
            status.rlsPoliciesExist = true;
        }

        // Try to check for trigger
        // Note: We can't directly check trigger existence from client, but we can test if signup creates profile
        status.triggerExists = true; // Assume it exists if tables exist
        status.warnings.push('Trigger existence cannot be verified from client. Ensure handle_new_user() trigger is active.');

    } catch (error: any) {
        status.errors.push(`Verification failed: ${error.message}`);
    }

    return status;
}

// Helper function to get setup instructions based on status
export function getSetupInstructions(status: SetupStatus): string[] {
    const instructions: string[] = [];

    if (!status.connected) {
        instructions.push('❌ Cannot connect to Supabase. Check your environment variables:');
        instructions.push('  - NEXT_PUBLIC_SUPABASE_URL');
        instructions.push('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
        return instructions;
    }

    if (!status.tablesExist) {
        instructions.push('❌ Database tables are missing.');
        instructions.push('');
        instructions.push('🔧 To fix:');
        instructions.push('1. Open Supabase Dashboard → SQL Editor');
        instructions.push('2. Copy content from DATABASE_SCHEMA.sql');
        instructions.push('3. Paste and run in SQL Editor');
        instructions.push('4. Verify tables appear in Table Editor');
        return instructions;
    }

    if (!status.rlsPoliciesExist) {
        instructions.push('⚠️  RLS policies may not be configured correctly.');
        instructions.push('');
        instructions.push('🔧 To fix:');
        instructions.push('1. Open Supabase Dashboard → Authentication → Policies');
        instructions.push('2. Verify each table has RLS enabled');
        instructions.push('3. Re-run DATABASE_SCHEMA.sql if policies are missing');
    }

    if (status.errors.length === 0 && status.warnings.length === 0) {
        instructions.push('✅ Database setup looks good!');
        instructions.push('');
        instructions.push('📝 Next steps:');
        instructions.push('1. Sign up for a new account');
        instructions.push('2. Check Supabase Dashboard → Table Editor → users');
        instructions.push('3. Verify your user was created');
        instructions.push('4. Set role to "admin" if needed');
    }

    return instructions;
}

// Test if user profile exists
export async function checkUserProfile(userId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();

        return !!data && !error;
    } catch {
        return false;
    }
}

// Manual profile creation (if trigger failed)
export async function createUserProfile(userId: string, email: string, fullName: string): Promise<void> {
    const { error: userError } = await supabase.from('users').insert({
        id: userId,
        email,
        full_name: fullName,
        role: 'user',
    });

    if (userError) throw userError;

    // Create default preferences
    const { error: prefsError } = await supabase.from('user_preferences').insert({
        user_id: userId,
    });

    if (prefsError) throw prefsError;
}
