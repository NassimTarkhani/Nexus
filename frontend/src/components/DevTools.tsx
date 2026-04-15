"use client";

import { useEffect } from 'react';

export function DevTools() {
    useEffect(() => {
        // Only load debug tools in development
        if (process.env.NODE_ENV === 'development') {
            import('@/src/lib/debugAuth').then(({ debugAuth, checkUserExists, getAuthSettings }) => {
                (window as any).debugSupabaseAuth = debugAuth;
                (window as any).checkUserExists = checkUserExists;
                (window as any).getAuthSettings = getAuthSettings;

                console.log('%c🔧 NEXUS Debug Tools Loaded', 'color: #60a5fa; font-weight: bold; font-size: 14px;');
                console.log('%cAvailable commands:', 'color: #a78bfa; font-weight: bold;');
                console.log('%c  • debugSupabaseAuth()', 'color: #34d399; padding-left: 8px;', '- Check full auth status');
                console.log('%c  • checkUserExists("email@example.com")', 'color: #34d399; padding-left: 8px;', '- Check if user exists');
                console.log('%c  • getAuthSettings()', 'color: #34d399; padding-left: 8px;', '- Check environment config');
            });
        }
    }, []);

    return null;
}
