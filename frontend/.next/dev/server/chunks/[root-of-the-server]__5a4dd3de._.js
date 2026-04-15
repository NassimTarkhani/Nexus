module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/frontend/src/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://xrotkyrndrpsgnckbnfe.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyb3RreXJuZHJwc2duY2tibmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjYyMDIsImV4cCI6MjA4ODI0MjIwMn0.p0BjC9hDZjNF9ZgLPP1GDqqH0ptGbnIc4_gxqweMOTM");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/frontend/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ai-sdk/openai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ai-sdk/provider-utils/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
;
;
const maxDuration = 60;
const FREE_MODEL_FALLBACK = 'openai/gpt-oss-120b:free';
const KNOWN_UNAVAILABLE_FREE_MODELS = new Set([
    'google/gemini-2.0-flash-exp:free',
    'mistralai/mistral-small-3.2-24b-instruct:free',
    'qwen/qwen3-235b-a22b:free',
    'qwen/qwen3-30b-a3b:free',
    'deepseek/deepseek-r1-0528:free',
    'deepseek/deepseek-chat-v3-0324:free',
    'microsoft/phi-4-reasoning-plus:free',
    'moonshotai/kimi-dev-72b:free',
    'meta-llama/llama-4-maverick:free'
]);
function resolveModel(requestedModel) {
    return KNOWN_UNAVAILABLE_FREE_MODELS.has(requestedModel) ? FREE_MODEL_FALLBACK : requestedModel;
}
function isRetryableOpenRouterKeyError(message) {
    const normalized = message.toLowerCase();
    return normalized.includes('user not found') || normalized.includes('unauthorized') || normalized.includes('incorrect api key') || normalized.includes('invalid api key') || normalized.includes('api key usd spend limit exceeded') || normalized.includes('credit limit') || normalized.includes('401');
}
async function generateWithOpenRouter(options) {
    const openrouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
        apiKey: options.apiKey,
        baseURL: 'https://openrouter.ai/api/v1'
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
        model: openrouter.chat(options.model),
        messages: options.messages,
        temperature: options.temperature,
        ...options.tools ? {
            tools: options.tools,
            maxSteps: 5
        } : {}
    });
}
// ── Tool definitions ───────────────────────────────────────────────────────
function buildTools(req, toolMode) {
    if (toolMode === 'none') return undefined;
    return {
        webSearch: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
            description: 'Search the web for real-time information. Use this for current events, facts, and anything outside your training data.',
            inputSchema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["zodSchema"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                query: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The search query'),
                maxResults: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().default(5)
            })),
            execute: async ({ query, maxResults })=>{
                const limit = maxResults ?? 5;
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
                if (!res.ok) return {
                    error: `Search failed: ${res.status}`
                };
                return await res.json();
            }
        }),
        runJavaScript: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
            description: 'Execute JavaScript code and return output. Useful for calculations and data manipulation.',
            inputSchema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["zodSchema"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('JavaScript code to execute')
            })),
            execute: async ({ code })=>{
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                const res = await fetch(`${baseUrl}/api/js-exec`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code
                    })
                });
                if (!res.ok) return {
                    error: `Execution failed: ${res.status}`
                };
                return await res.json();
            }
        }),
        generateImage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
            description: 'Generate an image from a text description using DALL-E 3 or Gemini Imagen.',
            inputSchema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["zodSchema"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                prompt: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('Detailed description of the image to generate'),
                size: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
                    '1024x1024',
                    '1792x1024',
                    '1024x1792'
                ]).default('1024x1024')
            })),
            execute: async ({ prompt, size })=>{
                const imgSize = size ?? '1024x1024';
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                const geminiKey = process.env.GEMINI_API_KEY;
                const openaiKey = process.env.OPENAI_API_KEY;
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (geminiKey) headers['x-gemini-api-key'] = geminiKey;
                if (openaiKey) headers['x-openai-api-key'] = openaiKey;
                const provider = geminiKey ? 'gemini' : 'openai';
                const res = await fetch(`${baseUrl}/api/image-gen`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        prompt,
                        provider,
                        size: imgSize
                    })
                });
                if (!res.ok) return {
                    error: 'Image generation failed'
                };
                const data = await res.json();
                return {
                    url: data.url,
                    prompt
                };
            }
        }),
        getCurrentDateTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
            description: 'Get the current date and time.',
            inputSchema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["zodSchema"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({})),
            execute: async ()=>({
                    datetime: new Date().toISOString()
                })
        }),
        browsePage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tool"])({
            description: 'Open a URL in a headless browser using Playwright and return the page content. ' + 'Use this to fetch live web pages, read articles, or get content from any website.',
            inputSchema: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$provider$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["zodSchema"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                url: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().describe('The full URL to open, e.g. https://example.com')
            })),
            execute: async ({ url })=>{
                const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
                try {
                    // Navigate to the URL
                    const navRes = await fetch(`${baseUrl}/api/mcp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            method: 'tools/call',
                            params: {
                                name: 'browser_navigate',
                                arguments: {
                                    url
                                }
                            }
                        })
                    });
                    if (!navRes.ok) return {
                        error: `Navigation failed: ${navRes.status}`,
                        url
                    };
                    // Get accessibility snapshot (structured text content)
                    const snapRes = await fetch(`${baseUrl}/api/mcp`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            method: 'tools/call',
                            params: {
                                name: 'browser_snapshot',
                                arguments: {}
                            }
                        })
                    });
                    if (!snapRes.ok) return {
                        error: `Snapshot failed: ${snapRes.status}`,
                        url
                    };
                    const data = await snapRes.json();
                    const text = data.result?.content?.map((c)=>c.text ?? '').join('\n') ?? '';
                    return {
                        url,
                        content: text.slice(0, 8000)
                    };
                } catch (err) {
                    return {
                        error: err instanceof Error ? err.message : 'Browser error',
                        url
                    };
                }
            }
        })
    };
}
async function POST(req) {
    try {
        const body = await req.json();
        const { messages, model, conversationId, workflowId, presetId, temperature = 0.7, toolMode = 'auto' } = body;
        if (!messages || !model) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: messages and model'
            }, {
                status: 400
            });
        }
        // Client fetches the key fresh from DB before each request and sends it here.
        // Fall back to env var for dev/self-hosted setups without a saved DB key.
        const headerApiKey = req.headers.get('x-openrouter-api-key');
        const envApiKey = process.env.OPENROUTER_API_KEY || null;
        const apiKey = headerApiKey || envApiKey;
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'OpenRouter API key not found. Go to Settings and save your key.'
            }, {
                status: 401
            });
        }
        // Build system prompt
        let systemPrompt = '';
        // Preset system prompt
        if (presetId) {
            try {
                const { data: preset } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('user_presets').select('system_prompt').eq('id', presetId).single();
                if (preset?.system_prompt) {
                    systemPrompt += preset.system_prompt + '\n\n';
                }
            } catch  {
            // user_presets table may not exist yet
            }
        }
        // Workflow context
        if (workflowId) {
            try {
                const { data: workflow } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').select('name, description').eq('id', workflowId).single();
                if (workflow) {
                    systemPrompt += `You are executing the "${workflow.name}" workflow. ${workflow.description || ''}\n\n`;
                }
            } catch  {
            // ignore
            }
        }
        // MCP tool context
        if (toolMode !== 'none') {
            systemPrompt += 'You have access to tools: webSearch, runJavaScript, generateImage, getCurrentDateTime. ' + 'Use them proactively when the user asks for current information, computations, or images.\n\n';
        }
        const processedMessages = systemPrompt ? [
            {
                role: 'system',
                content: systemPrompt
            },
            ...messages
        ] : messages;
        const resolvedModel = resolveModel(model);
        const tools = buildTools(req, toolMode);
        let result;
        try {
            result = await generateWithOpenRouter({
                apiKey,
                model: resolvedModel,
                messages: processedMessages,
                temperature,
                tools
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'OpenRouter request failed';
            const shouldRetryWithEnv = Boolean(headerApiKey && envApiKey && headerApiKey !== envApiKey && isRetryableOpenRouterKeyError(message));
            if (!shouldRetryWithEnv) {
                throw error;
            }
            result = await generateWithOpenRouter({
                apiKey: envApiKey,
                model: resolvedModel,
                messages: processedMessages,
                temperature,
                tools
            });
        }
        const payload = [
            `data: ${JSON.stringify({
                content: result.text ?? '',
                done: false
            })}`,
            'data: [DONE]',
            ''
        ].join('\n\n');
        return new Response(payload, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.error('Chat API error:', message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a4dd3de._.js.map