(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__c9fd8708._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/frontend/src/lib/supabase.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-edge-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://xrotkyrndrpsgnckbnfe.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyb3RreXJuZHJwc2duY2tibmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjYyMDIsImV4cCI6MjA4ODI0MjIwMn0.p0BjC9hDZjNF9ZgLPP1GDqqH0ptGbnIc4_gxqweMOTM");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/frontend/src/app/api/chat/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/esm/api/server.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/esm/server/web/exports/index.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ai-sdk/openai/dist/index.mjs [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/ai/dist/index.mjs [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/supabase.ts [app-edge-route] (ecmascript)");
;
;
;
;
const runtime = 'edge';
async function POST(req) {
    try {
        const body = await req.json();
        const { messages, model, conversationId, workflowId, mcpToolSchema, presetId, temperature = 0.7 } = body;
        if (!messages || !model) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: messages and model'
            }, {
                status: 400
            });
        }
        // Client fetches the key fresh from DB before each request and sends it here.
        // Fall back to env var for dev/self-hosted setups without a saved DB key.
        const apiKey = req.headers.get('x-openrouter-api-key') || process.env.OPENROUTER_API_KEY || null;
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
                const { data: preset } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('user_presets').select('system_prompt').eq('id', presetId).single();
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
                const { data: workflow } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('user_workflows').select('name, description').eq('id', workflowId).single();
                if (workflow) {
                    systemPrompt += `You are executing the "${workflow.name}" workflow. ${workflow.description || ''}\n\n`;
                }
            } catch  {
            // ignore
            }
        }
        // MCP tool context
        if (mcpToolSchema) {
            systemPrompt += `You have access to the following MCP tool: ${JSON.stringify(mcpToolSchema)}\n\n`;
        }
        const processedMessages = systemPrompt ? [
            {
                role: 'system',
                content: systemPrompt
            },
            ...messages
        ] : messages;
        const openrouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
            apiKey,
            baseURL: 'https://openrouter.ai/api/v1'
        });
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
            model: openrouter.chat(model),
            messages: processedMessages,
            temperature
        });
        const encoder = new TextEncoder();
        let fullResponse = '';
        const stream = new ReadableStream({
            async start (controller) {
                try {
                    for await (const chunk of result.textStream){
                        fullResponse += chunk;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            content: chunk,
                            done: false
                        })}\n\n`));
                    }
                    if (conversationId) {
                        try {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('messages').insert({
                                conversation_id: conversationId,
                                role: 'assistant',
                                content: fullResponse,
                                model,
                                provider: 'openrouter'
                            });
                        } catch (dbErr) {
                            console.error('Failed to save assistant message:', dbErr);
                        }
                        try {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('conversations').update({
                                updated_at: new Date().toISOString()
                            }).eq('id', conversationId);
                        } catch (dbErr) {
                            console.error('Failed to update conversation:', dbErr);
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                }
            }
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c9fd8708._.js.map