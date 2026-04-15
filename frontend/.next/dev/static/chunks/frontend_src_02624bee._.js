(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/lib/hooks/useTheme.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children }) {
    _s();
    const [themeStyle, setThemeStyleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("dark");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            // Load saved theme from localStorage
            const saved = localStorage.getItem("nexus-theme");
            if (saved && (saved === "dark" || saved === "light" || saved === "atmospheric")) {
                setThemeStyleState(saved);
            }
            setMounted(true);
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (!mounted) return;
            // Apply theme to document
            document.documentElement.setAttribute("data-theme", themeStyle);
            // Save to localStorage
            localStorage.setItem("nexus-theme", themeStyle);
        }
    }["ThemeProvider.useEffect"], [
        themeStyle,
        mounted
    ]);
    const setThemeStyle = (style)=>{
        setThemeStyleState(style);
    };
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            themeStyle,
            setThemeStyle
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/lib/hooks/useTheme.tsx",
        lineNumber: 46,
        columnNumber: 9
    }, this);
}
_s(ThemeProvider, "YxfKGtBDnW7a9pXTCxZsXDmoiYg=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/components/DevTools.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DevTools",
    ()=>DevTools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function DevTools() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DevTools.useEffect": ()=>{
            // Only load debug tools in development
            if ("TURBOPACK compile-time truthy", 1) {
                __turbopack_context__.A("[project]/frontend/src/lib/debugAuth.ts [app-client] (ecmascript, async loader)").then({
                    "DevTools.useEffect": ({ debugAuth, checkUserExists, getAuthSettings })=>{
                        window.debugSupabaseAuth = debugAuth;
                        window.checkUserExists = checkUserExists;
                        window.getAuthSettings = getAuthSettings;
                        console.log('%c🔧 NEXUS Debug Tools Loaded', 'color: #60a5fa; font-weight: bold; font-size: 14px;');
                        console.log('%cAvailable commands:', 'color: #a78bfa; font-weight: bold;');
                        console.log('%c  • debugSupabaseAuth()', 'color: #34d399; padding-left: 8px;', '- Check full auth status');
                        console.log('%c  • checkUserExists("email@example.com")', 'color: #34d399; padding-left: 8px;', '- Check if user exists');
                        console.log('%c  • getAuthSettings()', 'color: #34d399; padding-left: 8px;', '- Check environment config');
                    }
                }["DevTools.useEffect"]);
            }
        }
    }["DevTools.useEffect"], []);
    return null;
}
_s(DevTools, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = DevTools;
var _c;
__turbopack_context__.k.register(_c, "DevTools");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/components/BackgroundAnimations.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackgroundAnimations",
    ()=>BackgroundAnimations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$hooks$2f$useTheme$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/hooks/useTheme.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function BackgroundAnimations() {
    _s();
    const { themeStyle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$hooks$2f$useTheme$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const theme = themeStyle;
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Theme-specific color palettes
    const getColors = ()=>{
        switch(theme){
            case "light":
                return {
                    blob1: "rgba(79, 70, 229, 0.15)",
                    blob2: "rgba(147, 51, 234, 0.15)",
                    blob3: "rgba(236, 72, 153, 0.15)",
                    blob4: "rgba(59, 130, 246, 0.15)"
                };
            case "atmospheric":
                return {
                    blob1: "rgba(99, 102, 241, 0.2)",
                    blob2: "rgba(139, 92, 246, 0.2)",
                    blob3: "rgba(168, 85, 247, 0.2)",
                    blob4: "rgba(59, 130, 246, 0.2)"
                };
            case "dark":
            default:
                return {
                    blob1: "rgba(79, 70, 229, 0.1)",
                    blob2: "rgba(147, 51, 234, 0.1)",
                    blob3: "rgba(16, 185, 129, 0.1)",
                    blob4: "rgba(59, 130, 246, 0.1)"
                };
        }
    };
    const colors = getColors();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "fixed inset-0 overflow-hidden pointer-events-none",
        style: {
            zIndex: -1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute rounded-full blur-3xl",
                style: {
                    background: colors.blob1,
                    width: "40vw",
                    height: "40vw",
                    maxWidth: "600px",
                    maxHeight: "600px"
                },
                animate: {
                    x: [
                        "-10%",
                        "10%",
                        "-10%"
                    ],
                    y: [
                        "-10%",
                        "15%",
                        "-10%"
                    ],
                    scale: [
                        1,
                        1.1,
                        1
                    ]
                },
                transition: {
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                initial: {
                    x: "-10%",
                    y: "-10%"
                }
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/BackgroundAnimations.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute rounded-full blur-3xl",
                style: {
                    background: colors.blob2,
                    width: "35vw",
                    height: "35vw",
                    maxWidth: "500px",
                    maxHeight: "500px",
                    right: 0,
                    top: 0
                },
                animate: {
                    x: [
                        "10%",
                        "-15%",
                        "10%"
                    ],
                    y: [
                        "10%",
                        "-10%",
                        "10%"
                    ],
                    scale: [
                        1,
                        1.15,
                        1
                    ]
                },
                transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                initial: {
                    x: "10%",
                    y: "10%"
                }
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/BackgroundAnimations.tsx",
                lineNumber: 72,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute rounded-full blur-3xl",
                style: {
                    background: colors.blob3,
                    width: "30vw",
                    height: "30vw",
                    maxWidth: "450px",
                    maxHeight: "450px",
                    left: "50%",
                    bottom: 0
                },
                animate: {
                    x: [
                        "-20%",
                        "20%",
                        "-20%"
                    ],
                    y: [
                        "0%",
                        "-20%",
                        "0%"
                    ],
                    scale: [
                        1,
                        1.2,
                        1
                    ]
                },
                transition: {
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                initial: {
                    x: "-20%",
                    y: "0%"
                }
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/BackgroundAnimations.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute rounded-full blur-3xl",
                style: {
                    background: colors.blob4,
                    width: "25vw",
                    height: "25vw",
                    maxWidth: "400px",
                    maxHeight: "400px",
                    right: "20%",
                    bottom: "20%"
                },
                animate: {
                    x: [
                        "0%",
                        "25%",
                        "0%"
                    ],
                    y: [
                        "0%",
                        "25%",
                        "0%"
                    ],
                    scale: [
                        1,
                        1.1,
                        1
                    ],
                    rotate: [
                        0,
                        90,
                        0
                    ]
                },
                transition: {
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                initial: {
                    x: "0%",
                    y: "0%"
                }
            }, void 0, false, {
                fileName: "[project]/frontend/src/components/BackgroundAnimations.tsx",
                lineNumber: 122,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/src/components/BackgroundAnimations.tsx",
        lineNumber: 43,
        columnNumber: 9
    }, this);
}
_s(BackgroundAnimations, "lhBlDy52nps+5AgYTSnOc8LLSoI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$hooks$2f$useTheme$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = BackgroundAnimations;
var _c;
__turbopack_context__.k.register(_c, "BackgroundAnimations");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://xrotkyrndrpsgnckbnfe.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyb3RreXJuZHJwc2duY2tibmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjYyMDIsImV4cCI6MjA4ODI0MjIwMn0.p0BjC9hDZjNF9ZgLPP1GDqqH0ptGbnIc4_gxqweMOTM");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppStore",
    ()=>useAppStore,
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        user: null,
        loading: true,
        initialized: false,
        setUser: (user)=>set({
                user,
                loading: false
            }),
        signOut: async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            set({
                user: null
            });
            // Redirect to signin page
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/auth/signin';
            }
        },
        initAuth: async ()=>{
            try {
                // Get current session
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (session?.user) {
                    // Fetch user profile from public.users
                    const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('id', session.user.id).single();
                    if (profile) {
                        set({
                            user: {
                                id: profile.id,
                                email: profile.email,
                                full_name: profile.full_name,
                                role: profile.role
                            },
                            loading: false,
                            initialized: true
                        });
                    } else {
                        set({
                            user: null,
                            loading: false,
                            initialized: true
                        });
                    }
                } else {
                    set({
                        user: null,
                        loading: false,
                        initialized: true
                    });
                }
                // Listen for auth changes
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange(async (event, session)=>{
                    if (event === 'SIGNED_IN' && session?.user) {
                        const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('id', session.user.id).single();
                        if (profile) {
                            set({
                                user: {
                                    id: profile.id,
                                    email: profile.email,
                                    full_name: profile.full_name,
                                    role: profile.role
                                },
                                loading: false
                            });
                        }
                    } else if (event === 'SIGNED_OUT') {
                        set({
                            user: null,
                            loading: false
                        });
                    }
                });
            } catch (error) {
                console.error('Auth init error:', error);
                set({
                    user: null,
                    loading: false,
                    initialized: true
                });
            }
        }
    }));
const useAppStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        messages: [
            {
                id: '1',
                role: 'assistant',
                content: 'Hello! I am NEXUS. How can I help you today?',
                timestamp: 1709654400000
            }
        ],
        addMessage: (message)=>set((state)=>({
                    messages: [
                        ...state.messages,
                        message
                    ]
                })),
        clearMessages: ()=>set({
                messages: []
            }),
        isSidebarOpen: true,
        setSidebarOpen: (open)=>set({
                isSidebarOpen: open
            })
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userService",
    ()=>userService
]);
// User Management Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const userService = {
    // Get current user profile
    async getCurrentUser () {
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (!user) return null;
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('id', user.id).single();
        if (error) throw error;
        return data;
    },
    // Get all users (admin only)
    async getAllUsers () {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return data;
    },
    // Get user by ID
    async getUserById (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('id', userId).single();
        if (error) throw error;
        return data;
    },
    // Update user profile
    async updateUser (userId, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').update(updates).eq('id', userId).select().single();
        if (error) throw error;
        return data;
    },
    // Delete user (admin only)
    async deleteUser (userId) {
        // Delete from auth (cascades to public.users)
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.admin.deleteUser(userId);
        if (error) throw error;
    },
    // Check if user is admin
    async isAdmin (userId) {
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('role').eq('id', userId).single();
        return data?.role === 'admin';
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/preferences.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "preferencesService",
    ()=>preferencesService
]);
// User Preferences Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const preferencesService = {
    // Get user preferences
    async getPreferences (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_preferences').select('*').eq('user_id', userId).single();
        if (error) {
            // If preferences don't exist, create default ones
            if (error.code === 'PGRST116') {
                return this.createDefaultPreferences(userId);
            }
            throw error;
        }
        return data;
    },
    // Create default preferences
    async createDefaultPreferences (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_preferences').insert({
            user_id: userId,
            theme: 'dark',
            language: 'en',
            chat_temperature: 0.7,
            tool_mode: 'auto'
        }).select().single();
        if (error) throw error;
        return data;
    },
    // Update preferences
    async updatePreferences (userId, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_preferences').update(updates).eq('user_id', userId).select().single();
        if (error) throw error;
        return data;
    },
    // Update theme
    async updateTheme (userId, theme) {
        return this.updatePreferences(userId, {
            theme
        });
    },
    // Update language
    async updateLanguage (userId, language) {
        return this.updatePreferences(userId, {
            language
        });
    },
    // Update chat temperature
    async updateTemperature (userId, temperature) {
        return this.updatePreferences(userId, {
            chat_temperature: temperature
        });
    },
    // Update tool mode
    async updateToolMode (userId, toolMode) {
        return this.updatePreferences(userId, {
            tool_mode: toolMode
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/apiKeys.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiKeysService",
    ()=>apiKeysService
]);
// API Keys Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const apiKeysService = {
    // Get all API keys for user
    async getApiKeys (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_api_keys').select('*').eq('user_id', userId).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return data || [];
    },
    // Get API key by provider
    async getApiKeyByProvider (userId, provider) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_api_keys').select('*').eq('user_id', userId).eq('provider', provider).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },
    // Add or update API key
    async upsertApiKey (apiKey) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_api_keys').upsert(apiKey, {
            onConflict: 'user_id,provider'
        }).select().single();
        if (error) throw error;
        return data;
    },
    // Update API key
    async updateApiKey (id, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_api_keys').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    // Toggle API key enabled status
    async toggleApiKey (id, enabled) {
        return this.updateApiKey(id, {
            enabled
        });
    },
    // Delete API key
    async deleteApiKey (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_api_keys').delete().eq('id', id);
        if (error) throw error;
    },
    // Get enabled API keys
    async getEnabledApiKeys (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_api_keys').select('*').eq('user_id', userId).eq('enabled', true);
        if (error) throw error;
        return data || [];
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/agents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "agentsService",
    ()=>agentsService
]);
// Agents Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const agentsService = {
    // Get all agents for user
    async getAgents (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_agents').select('*').eq('user_id', userId).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return data || [];
    },
    // Get agent by ID
    async getAgentById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_agents').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },
    // Create agent
    async createAgent (agent) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_agents').insert(agent).select().single();
        if (error) throw error;
        return data;
    },
    // Update agent
    async updateAgent (id, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_agents').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    // Delete agent
    async deleteAgent (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_agents').delete().eq('id', id);
        if (error) throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/workflows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "workflowsService",
    ()=>workflowsService
]);
// Workflows Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const workflowsService = {
    // Get all workflows for user
    async getWorkflows (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').select('*').eq('user_id', userId).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return data || [];
    },
    // Get workflow by ID
    async getWorkflowById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },
    // Create workflow
    async createWorkflow (workflow) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').insert(workflow).select().single();
        if (error) throw error;
        return data;
    },
    // Update workflow
    async updateWorkflow (id, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    // Delete workflow
    async deleteWorkflow (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').delete().eq('id', id);
        if (error) throw error;
    },
    // Toggle workflow published status
    async togglePublished (id, isPublished) {
        return this.updateWorkflow(id, {
            is_published: isPublished
        });
    },
    // Get published workflows
    async getPublishedWorkflows (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').select('*').eq('user_id', userId).eq('is_published', true);
        if (error) throw error;
        return data || [];
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/mcpServers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mcpServersService",
    ()=>mcpServersService
]);
// MCP Servers Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const mcpServersService = {
    // Get all MCP servers for user
    async getMcpServers (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_mcp_servers').select('*').eq('user_id', userId).order('created_at', {
            ascending: false
        });
        if (error) throw error;
        return data || [];
    },
    // Get MCP server by ID
    async getMcpServerById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_mcp_servers').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },
    // Create MCP server
    async createMcpServer (server) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_mcp_servers').insert(server).select().single();
        if (error) throw error;
        return data;
    },
    // Update MCP server
    async updateMcpServer (id, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_mcp_servers').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    // Delete MCP server
    async deleteMcpServer (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_mcp_servers').delete().eq('id', id);
        if (error) throw error;
    },
    // Update connection status
    async updateConnectionStatus (id, status) {
        return this.updateMcpServer(id, {
            status
        });
    },
    // Get connected MCP servers
    async getConnectedMcpServers (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_mcp_servers').select('*').eq('user_id', userId).eq('status', 'connected');
        if (error) throw error;
        return data || [];
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/conversations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "conversationsService",
    ()=>conversationsService
]);
// Conversations Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const conversationsService = {
    // Get all conversations for user
    async getConversations (userId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('conversations').select('*').eq('user_id', userId).order('updated_at', {
            ascending: false
        });
        if (error) throw error;
        return data || [];
    },
    // Get conversation by ID
    async getConversationById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('conversations').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },
    // Create conversation
    async createConversation (conversation) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('conversations').insert(conversation).select().single();
        if (error) throw error;
        return data;
    },
    // Update conversation
    async updateConversation (id, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('conversations').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    // Update conversation title
    async updateTitle (id, title) {
        return this.updateConversation(id, {
            title
        });
    },
    // Delete conversation (messages will be deleted via CASCADE)
    async deleteConversation (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('conversations').delete().eq('id', id);
        if (error) throw error;
    },
    // Search conversations
    async searchConversations (userId, query) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('conversations').select('*').eq('user_id', userId).ilike('title', `%${query}%`).order('updated_at', {
            ascending: false
        });
        if (error) throw error;
        return data || [];
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/messages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "messagesService",
    ()=>messagesService
]);
// Messages Service
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-client] (ecmascript)");
;
const messagesService = {
    // Get all messages for a conversation
    async getMessages (conversationId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*').eq('conversation_id', conversationId).order('created_at', {
            ascending: true
        });
        if (error) throw error;
        return data || [];
    },
    // Get message by ID
    async getMessageById (id) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },
    // Create message
    async createMessage (message) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').insert(message).select().single();
        if (error) throw error;
        return data;
    },
    // Update message
    async updateMessage (id, updates) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    // Delete message
    async deleteMessage (id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').delete().eq('id', id);
        if (error) throw error;
    },
    // Get messages by role
    async getMessagesByRole (conversationId, role) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*').eq('conversation_id', conversationId).eq('role', role).order('created_at', {
            ascending: true
        });
        if (error) throw error;
        return data || [];
    },
    // Search messages
    async searchMessages (conversationId, query) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*').eq('conversation_id', conversationId).ilike('content', `%${query}%`).order('created_at', {
            ascending: true
        });
        if (error) throw error;
        return data || [];
    },
    // Get last message in conversation
    async getLastMessage (conversationId) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*').eq('conversation_id', conversationId).order('created_at', {
            ascending: false
        }).limit(1).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },
    // Count messages in conversation
    async countMessages (conversationId) {
        const { count, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*', {
            count: 'exact',
            head: true
        }).eq('conversation_id', conversationId);
        if (error) throw error;
        return count || 0;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/services/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Export all services from a single entry point
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/preferences.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$apiKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/apiKeys.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/agents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/workflows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/mcpServers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$conversations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/conversations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$messages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/messages.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/hooks/useDatabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAgents",
    ()=>useAgents,
    "useApiKeys",
    ()=>useApiKeys,
    "useConversations",
    ()=>useConversations,
    "useMcpServers",
    ()=>useMcpServers,
    "useMessages",
    ()=>useMessages,
    "usePreferences",
    ()=>usePreferences,
    "useWorkflows",
    ()=>useWorkflows
]);
// React hooks for database operations
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/preferences.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$apiKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/apiKeys.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/agents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/workflows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/mcpServers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$conversations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/conversations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$messages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/services/messages.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
function usePreferences() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [preferences, setPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchPreferences = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreferences.useCallback[fetchPreferences]": async ()=>{
            if (!user) return;
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preferencesService"].getPreferences(user.id);
                setPreferences(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["usePreferences.useCallback[fetchPreferences]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePreferences.useEffect": ()=>{
            fetchPreferences();
        }
    }["usePreferences.useEffect"], [
        fetchPreferences
    ]);
    const updateTheme = async (theme)=>{
        if (!user) return;
        try {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preferencesService"].updateTheme(user.id, theme);
            setPreferences(updated);
        } catch (err) {
            setError(err.message);
        }
    };
    const updateLanguage = async (language)=>{
        if (!user) return;
        try {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preferencesService"].updateLanguage(user.id, language);
            setPreferences(updated);
        } catch (err) {
            setError(err.message);
        }
    };
    const updateTemperature = async (temperature)=>{
        if (!user) return;
        try {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preferencesService"].updateTemperature(user.id, temperature);
            setPreferences(updated);
        } catch (err) {
            setError(err.message);
        }
    };
    const updateToolMode = async (toolMode)=>{
        if (!user) return;
        try {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$preferences$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preferencesService"].updateToolMode(user.id, toolMode);
            setPreferences(updated);
        } catch (err) {
            setError(err.message);
        }
    };
    return {
        preferences,
        loading,
        error,
        refresh: fetchPreferences,
        updateTheme,
        updateLanguage,
        updateTemperature,
        updateToolMode
    };
}
_s(usePreferences, "dP8+eBadRHZJvqvZBiTLs7zrYCQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
function useApiKeys() {
    _s1();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [apiKeys, setApiKeys] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchApiKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useApiKeys.useCallback[fetchApiKeys]": async ()=>{
            if (!user) {
                setApiKeys([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$apiKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiKeysService"].getApiKeys(user.id);
                setApiKeys(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["useApiKeys.useCallback[fetchApiKeys]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useApiKeys.useEffect": ()=>{
            fetchApiKeys();
        }
    }["useApiKeys.useEffect"], [
        fetchApiKeys
    ]);
    const upsertApiKey = async (provider, apiKey, baseUrl)=>{
        if (!user) return;
        try {
            const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$apiKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiKeysService"].upsertApiKey({
                user_id: user.id,
                provider,
                api_key: apiKey,
                base_url: baseUrl || null,
                enabled: true
            });
            // Optimistic local update to avoid blocking UI on a second roundtrip
            setApiKeys((prev)=>{
                const withoutProvider = prev.filter((k)=>k.provider !== provider);
                return [
                    saved,
                    ...withoutProvider
                ];
            });
            // Refresh in background for consistency
            fetchApiKeys();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deleteApiKey = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$apiKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiKeysService"].deleteApiKey(id);
            await fetchApiKeys();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const toggleApiKey = async (id, enabled)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$apiKeys$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiKeysService"].toggleApiKey(id, enabled);
            await fetchApiKeys();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return {
        apiKeys,
        loading,
        error,
        refresh: fetchApiKeys,
        upsertApiKey,
        deleteApiKey,
        toggleApiKey
    };
}
_s1(useApiKeys, "N97dmDgFYjEDeoddvZSw1xQeIxg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
function useAgents() {
    _s2();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [agents, setAgents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchAgents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAgents.useCallback[fetchAgents]": async ()=>{
            if (!user) return;
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentsService"].getAgents(user.id);
                setAgents(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["useAgents.useCallback[fetchAgents]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAgents.useEffect": ()=>{
            fetchAgents();
        }
    }["useAgents.useEffect"], [
        fetchAgents
    ]);
    const createAgent = async (agent)=>{
        if (!user) return;
        try {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentsService"].createAgent({
                ...agent,
                user_id: user.id
            });
            await fetchAgents();
            return created;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const updateAgent = async (id, updates)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentsService"].updateAgent(id, updates);
            await fetchAgents();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deleteAgent = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$agents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentsService"].deleteAgent(id);
            await fetchAgents();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return {
        agents,
        loading,
        error,
        refresh: fetchAgents,
        createAgent,
        updateAgent,
        deleteAgent
    };
}
_s2(useAgents, "syYa1G1A/QvSvrnRt6Eat9njZmQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
function useWorkflows() {
    _s3();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [workflows, setWorkflows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchWorkflows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkflows.useCallback[fetchWorkflows]": async ()=>{
            if (!user) return;
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowsService"].getWorkflows(user.id);
                setWorkflows(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["useWorkflows.useCallback[fetchWorkflows]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWorkflows.useEffect": ()=>{
            fetchWorkflows();
        }
    }["useWorkflows.useEffect"], [
        fetchWorkflows
    ]);
    const createWorkflow = async (workflow)=>{
        if (!user) return;
        try {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowsService"].createWorkflow({
                ...workflow,
                user_id: user.id
            });
            await fetchWorkflows();
            return created;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const updateWorkflow = async (id, updates)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowsService"].updateWorkflow(id, updates);
            await fetchWorkflows();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deleteWorkflow = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowsService"].deleteWorkflow(id);
            await fetchWorkflows();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const togglePublished = async (id, isPublished)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$workflows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workflowsService"].togglePublished(id, isPublished);
            await fetchWorkflows();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return {
        workflows,
        loading,
        error,
        refresh: fetchWorkflows,
        createWorkflow,
        updateWorkflow,
        deleteWorkflow,
        togglePublished
    };
}
_s3(useWorkflows, "dGCyxkqSbwjIC7ixaw8/S1vs3LU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
function useMcpServers() {
    _s4();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [mcpServers, setMcpServers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchMcpServers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMcpServers.useCallback[fetchMcpServers]": async ()=>{
            if (!user) return;
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mcpServersService"].getMcpServers(user.id);
                setMcpServers(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["useMcpServers.useCallback[fetchMcpServers]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMcpServers.useEffect": ()=>{
            fetchMcpServers();
        }
    }["useMcpServers.useEffect"], [
        fetchMcpServers
    ]);
    const createMcpServer = async (server)=>{
        if (!user) return;
        try {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mcpServersService"].createMcpServer({
                ...server,
                user_id: user.id
            });
            await fetchMcpServers();
            return created;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const updateMcpServer = async (id, updates)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mcpServersService"].updateMcpServer(id, updates);
            await fetchMcpServers();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deleteMcpServer = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mcpServersService"].deleteMcpServer(id);
            await fetchMcpServers();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const updateConnectionStatus = async (id, status)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$mcpServers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mcpServersService"].updateConnectionStatus(id, status);
            await fetchMcpServers();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return {
        mcpServers,
        loading,
        error,
        refresh: fetchMcpServers,
        createMcpServer,
        updateMcpServer,
        deleteMcpServer,
        updateConnectionStatus
    };
}
_s4(useMcpServers, "I6L0JzB14oFzu2H9BOl9JtyqdC0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
function useConversations() {
    _s5();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchConversations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useConversations.useCallback[fetchConversations]": async ()=>{
            if (!user) return;
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$conversations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["conversationsService"].getConversations(user.id);
                setConversations(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["useConversations.useCallback[fetchConversations]"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useConversations.useEffect": ()=>{
            fetchConversations();
        }
    }["useConversations.useEffect"], [
        fetchConversations
    ]);
    const createConversation = async (title)=>{
        if (!user) return;
        try {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$conversations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["conversationsService"].createConversation({
                user_id: user.id,
                title
            });
            await fetchConversations();
            return created;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const updateTitle = async (id, title)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$conversations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["conversationsService"].updateTitle(id, title);
            await fetchConversations();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deleteConversation = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$conversations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["conversationsService"].deleteConversation(id);
            await fetchConversations();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return {
        conversations,
        loading,
        error,
        refresh: fetchConversations,
        createConversation,
        updateTitle,
        deleteConversation
    };
}
_s5(useConversations, "pl0j+Yir2YDEvtbYXS1sl9hBTfY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
function useMessages(conversationId) {
    _s6();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMessages.useCallback[fetchMessages]": async ()=>{
            if (!conversationId) {
                setMessages([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$messages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messagesService"].getMessages(conversationId);
                setMessages(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        }
    }["useMessages.useCallback[fetchMessages]"], [
        conversationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMessages.useEffect": ()=>{
            fetchMessages();
        }
    }["useMessages.useEffect"], [
        fetchMessages
    ]);
    const createMessage = async (role, content, provider, model)=>{
        if (!conversationId) return;
        try {
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$messages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messagesService"].createMessage({
                conversation_id: conversationId,
                role,
                content,
                provider: provider || null,
                model: model || null
            });
            await fetchMessages();
            return created;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const updateMessage = async (id, content)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$messages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messagesService"].updateMessage(id, {
                content
            });
            await fetchMessages();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const deleteMessage = async (id)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$services$2f$messages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messagesService"].deleteMessage(id);
            await fetchMessages();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    return {
        messages,
        loading,
        error,
        refresh: fetchMessages,
        createMessage,
        updateMessage,
        deleteMessage
    };
}
_s6(useMessages, "wf3rq3C8BIhlL82v/s5VJE8z3z0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/lib/providers/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProviderStore",
    ()=>useProviderStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const ONLY_PROVIDER = 'openrouter';
const useProviderStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        providers: {},
        selectedProvider: ONLY_PROVIDER,
        selectedModel: null,
        setProviderConfig: (provider, config)=>provider !== ONLY_PROVIDER ? undefined : set((state)=>({
                    providers: {
                        ...state.providers,
                        [provider]: {
                            provider,
                            apiKey: config.apiKey ?? state.providers[provider]?.apiKey ?? '',
                            baseURL: config.baseURL ?? state.providers[provider]?.baseURL,
                            enabled: config.enabled ?? state.providers[provider]?.enabled ?? true
                        }
                    }
                })),
        getProviderConfig: (provider)=>{
            if (provider !== ONLY_PROVIDER) return null;
            const config = get().providers[provider];
            return config ?? null;
        },
        deleteProvider: (provider)=>set((state)=>{
                const newProviders = {
                    ...state.providers
                };
                delete newProviders[provider];
                return {
                    providers: newProviders
                };
            }),
        setSelectedProvider: ()=>set({
                selectedProvider: ONLY_PROVIDER
            }),
        setSelectedModel: (model)=>set({
                selectedModel: model
            }),
        getEnabledProviders: ()=>{
            const providers = get().providers;
            return Object.values(providers).filter((p)=>p.enabled && p.provider === ONLY_PROVIDER);
        }
    }), {
    name: 'nexus-providers',
    // NEVER persist API keys to localStorage — they live in the database only.
    // Only save UI-level prefs (which provider/model was selected).
    partialize: (state)=>({
            selectedProvider: state.selectedProvider,
            selectedModel: state.selectedModel
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/src/components/ApiKeysSyncer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiKeysSyncer",
    ()=>ApiKeysSyncer
]);
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$hooks$2f$useDatabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/hooks/useDatabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$providers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/providers/store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ApiKeysSyncer() {
    _s();
    const { apiKeys } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$hooks$2f$useDatabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiKeys"])();
    const { setProviderConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$providers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProviderStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ApiKeysSyncer.useEffect": ()=>{
            for (const key of apiKeys){
                if (key.enabled) {
                    setProviderConfig(key.provider, {
                        apiKey: key.api_key,
                        baseURL: key.base_url || undefined,
                        enabled: true
                    });
                }
            }
        }
    }["ApiKeysSyncer.useEffect"], [
        apiKeys,
        setProviderConfig
    ]);
    return null;
}
_s(ApiKeysSyncer, "/3V1E58hCxs7oFYFfWoPjahzshE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$hooks$2f$useDatabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiKeys"],
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$providers$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProviderStore"]
    ];
});
_c = ApiKeysSyncer;
var _c;
__turbopack_context__.k.register(_c, "ApiKeysSyncer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_02624bee._.js.map