// Supabase authentication debug utility
import { supabase } from './supabase';

export async function debugAuth() {
    console.group('🔍 Supabase Auth Debug');

    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current Session:', session ? {
        user_id: session.user.id,
        email: session.user.email,
        confirmed_at: session.user.confirmed_at,
        email_confirmed_at: session.user.email_confirmed_at,
    } : 'No active session');

    if (sessionError) {
        console.error('Session Error:', sessionError);
    }

    // Check if user profile exists
    if (session?.user.id) {
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        console.log('User Profile:', profile || 'Not found');
        if (profileError) {
            console.error('Profile Error:', profileError);
        }
    }

    // Check Supabase connection
    try {
        const { error: connectionError } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });

        if (connectionError) {
            console.error('Connection Error:', connectionError);
        } else {
            console.log('✅ Supabase connection OK');
        }
    } catch (err) {
        console.error('Connection Test Failed:', err);
    }

    console.groupEnd();
}

export async function checkUserExists(email: string) {
    console.log(`Checking if user exists: ${email}`);

    // Note: We can't directly query auth.users from the client
    // But we can check public.users table
    const { data, error } = await supabase
        .from('users')
        .select('id, email, role, created_at')
        .eq('email', email)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            console.log('❌ User not found in public.users');
            return null;
        }
        console.error('Error checking user:', error);
        return null;
    }

    console.log('✅ User found in public.users:', data);
    return data;
}

export async function getAuthSettings() {
    // This will help debug what's configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return {
        url: url ? '✅ Set' : '❌ Missing',
        key: key ? '✅ Set' : '❌ Missing',
        fullUrl: url,
    };
}

// Call this in browser console to debug auth issues
if (typeof window !== 'undefined') {
    (window as any).debugSupabaseAuth = debugAuth;
    (window as any).checkUserExists = checkUserExists;
    (window as any).getAuthSettings = getAuthSettings;
    console.log('🔧 Debug tools available:');
    console.log('  • debugSupabaseAuth() - Check auth status');
    console.log('  • checkUserExists(email) - Check if user exists');
    console.log('  • getAuthSettings() - Check environment variables');
}
