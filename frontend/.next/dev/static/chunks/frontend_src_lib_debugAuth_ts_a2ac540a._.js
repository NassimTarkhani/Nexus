(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/lib/debugAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkUserExists",
    ()=>checkUserExists,
    "debugAuth",
    ()=>debugAuth,
    "getAuthSettings",
    ()=>getAuthSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Supabase authentication debug utility
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
async function debugAuth() {
    console.group('🔍 Supabase Auth Debug');
    // Check current session
    const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    console.log('Current Session:', session ? {
        user_id: session.user.id,
        email: session.user.email,
        confirmed_at: session.user.confirmed_at,
        email_confirmed_at: session.user.email_confirmed_at
    } : 'No active session');
    if (sessionError) {
        console.error('Session Error:', sessionError);
    }
    // Check if user profile exists
    if (session?.user.id) {
        const { data: profile, error: profileError } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('id', session.user.id).single();
        console.log('User Profile:', profile || 'Not found');
        if (profileError) {
            console.error('Profile Error:', profileError);
        }
    }
    // Check Supabase connection
    try {
        const { error: connectionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('count', {
            count: 'exact',
            head: true
        });
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
async function checkUserExists(email) {
    console.log(`Checking if user exists: ${email}`);
    // Note: We can't directly query auth.users from the client
    // But we can check public.users table
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('id, email, role, created_at').eq('email', email).single();
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
async function getAuthSettings() {
    // This will help debug what's configured
    const url = ("TURBOPACK compile-time value", "https://xrotkyrndrpsgnckbnfe.supabase.co");
    const key = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyb3RreXJuZHJwc2duY2tibmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjYyMDIsImV4cCI6MjA4ODI0MjIwMn0.p0BjC9hDZjNF9ZgLPP1GDqqH0ptGbnIc4_gxqweMOTM");
    return {
        url: ("TURBOPACK compile-time truthy", 1) ? '✅ Set' : "TURBOPACK unreachable",
        key: ("TURBOPACK compile-time truthy", 1) ? '✅ Set' : "TURBOPACK unreachable",
        fullUrl: url
    };
}
// Call this in browser console to debug auth issues
if ("TURBOPACK compile-time truthy", 1) {
    window.debugSupabaseAuth = debugAuth;
    window.checkUserExists = checkUserExists;
    window.getAuthSettings = getAuthSettings;
    console.log('🔧 Debug tools available:');
    console.log('  • debugSupabaseAuth() - Check auth status');
    console.log('  • checkUserExists(email) - Check if user exists');
    console.log('  • getAuthSettings() - Check environment variables');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_lib_debugAuth_ts_a2ac540a._.js.map