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
"[project]/frontend/src/app/api/documents/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@ai-sdk/openai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
const runtime = "nodejs";
const maxDuration = 60;
const FREE_MODEL_FALLBACK = "openai/gpt-oss-120b:free";
async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid JSON body"
        }, {
            status: 400
        });
    }
    const { documentId, messages, model } = body;
    if (!documentId || !messages?.length) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing documentId or messages"
        }, {
            status: 400
        });
    }
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "OPENROUTER_API_KEY not configured"
        }, {
            status: 401
        });
    }
    const supabaseUrl = ("TURBOPACK compile-time value", "https://xrotkyrndrpsgnckbnfe.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyb3RreXJuZHJwc2duY2tibmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NjYyMDIsImV4cCI6MjA4ODI0MjIwMn0.p0BjC9hDZjNF9ZgLPP1GDqqH0ptGbnIc4_gxqweMOTM");
    const authHeader = req.headers.get("authorization") ?? "";
    const userToken = authHeader.replace(/^Bearer\s+/i, "");
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        }
    });
    try {
        // Load document
        const { data: doc, error: docError } = await supabase.from("documents").select("id, name, content, file_type").eq("id", documentId).single();
        if (docError || !doc) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Document not found"
            }, {
                status: 404
            });
        }
        // Get the user's latest message for targeted chunk retrieval
        const latestUserMsg = [
            ...messages
        ].reverse().find((m)=>m.role === "user");
        const query = latestUserMsg?.content ?? "";
        // Retrieve relevant chunks (simple text matching for MVP)
        let context = "";
        const { data: chunks } = await supabase.from("document_chunks").select("content, chunk_index").eq("document_id", documentId).order("chunk_index", {
            ascending: true
        });
        if (chunks && chunks.length > 0) {
            // For short documents (<20 chunks), include all content
            if (chunks.length <= 20) {
                context = chunks.map((c)=>c.content).join("\n\n");
            } else {
                // For longer documents, find chunks matching the query
                const queryLower = query.toLowerCase();
                const queryWords = queryLower.split(/\s+/).filter((w)=>w.length > 3);
                const scored = chunks.map((c)=>{
                    const lower = c.content.toLowerCase();
                    let score = 0;
                    for (const word of queryWords){
                        if (lower.includes(word)) score++;
                    }
                    return {
                        ...c,
                        score
                    };
                });
                // Take top 10 most relevant chunks + first 2 chunks for context
                const firstChunks = chunks.slice(0, 2);
                const topChunks = scored.filter((c)=>c.score > 0).sort((a, b)=>b.score - a.score).slice(0, 10);
                const selectedIds = new Set();
                for (const c of firstChunks)selectedIds.add(c.chunk_index);
                for (const c of topChunks)selectedIds.add(c.chunk_index);
                const selectedChunks = chunks.filter((c)=>selectedIds.has(c.chunk_index)).sort((a, b)=>a.chunk_index - b.chunk_index);
                context = selectedChunks.map((c)=>c.content).join("\n\n");
            }
        } else {
            // Fall back to full document content
            context = doc.content || "";
        }
        // Truncate context if too long (keep under ~12k tokens ≈ 48k chars)
        const MAX_CONTEXT_CHARS = 48000;
        if (context.length > MAX_CONTEXT_CHARS) {
            context = context.slice(0, MAX_CONTEXT_CHARS) + "\n\n[... document truncated for context window ...]";
        }
        const systemPrompt = `You are a helpful AI assistant analyzing a document.

Document name: "${doc.name}"
Document type: ${doc.file_type}

Below is the content of the document. Answer the user's questions based ONLY on this document content. If the answer is not in the document, say so clearly. Always cite specific parts of the document when possible.

---DOCUMENT CONTENT---
${context}
---END DOCUMENT---`;
        const resolvedModel = model || FREE_MODEL_FALLBACK;
        const openrouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1"
        });
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
            model: openrouter.chat(resolvedModel),
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                ...messages
            ],
            temperature: 0.3
        });
        // Return as SSE format for consistency with the main chat route
        const payload = [
            `data: ${JSON.stringify({
                content: result.text ?? "",
                done: false
            })}`,
            "data: [DONE]",
            ""
        ].join("\n\n");
        return new Response(payload, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive"
            }
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Document chat failed";
        console.error("[documents/chat] error:", message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a8207926._.js.map