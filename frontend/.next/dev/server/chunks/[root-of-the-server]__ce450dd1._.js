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
"[project]/frontend/src/app/api/documents/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
const runtime = "nodejs";
const CHUNK_SIZE = 1000; // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set([
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
    const chunks = [];
    let start = 0;
    while(start < text.length){
        const end = Math.min(start + size, text.length);
        chunks.push(text.slice(start, end));
        start += size - overlap;
        if (start >= text.length) break;
    }
    return chunks;
}
function estimateTokens(text) {
    // Rough estimate: ~4 chars per token for English
    return Math.ceil(text.length / 4);
}
async function POST(req) {
    let formData;
    try {
        formData = await req.formData();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Expected multipart/form-data body"
        }, {
            status: 400
        });
    }
    const file = formData.get("file");
    const userId = formData.get("userId");
    if (!file || typeof file === "string") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing file field"
        }, {
            status: 400
        });
    }
    if (!userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing userId field"
        }, {
            status: 400
        });
    }
    const blob = file;
    const fileName = file.name || "document";
    const fileType = blob.type || "application/octet-stream";
    if (blob.size > MAX_FILE_SIZE) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.`
        }, {
            status: 413
        });
    }
    // Create Supabase client authenticated as the requesting user (satisfies RLS)
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
        // Extract text based on file type
        let extractedText = "";
        if (fileType === "application/pdf") {
            const arrayBuf = await blob.arrayBuffer();
            const { extractText } = await __turbopack_context__.A("[project]/frontend/node_modules/unpdf/dist/index.mjs [app-route] (ecmascript, async loader)");
            const result = await extractText(new Uint8Array(arrayBuf));
            // result.text can be a string or string[] depending on version
            extractedText = Array.isArray(result.text) ? result.text.join("\n\n") : String(result.text ?? "");
        } else if (fileType.startsWith("text/") || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // For plain text/markdown/csv, read directly
            extractedText = await blob.text();
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Unsupported file type: ${fileType}. Supported: PDF, TXT, MD, CSV.`
            }, {
                status: 400
            });
        }
        if (!extractedText.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No text could be extracted from this file."
            }, {
                status: 422
            });
        }
        // Create document record
        const { data: doc, error: docError } = await supabase.from("documents").insert({
            user_id: userId,
            name: fileName,
            file_type: fileType,
            file_size: blob.size,
            content: extractedText,
            status: "processing"
        }).select().single();
        if (docError) {
            console.error("[documents/upload] DB insert error:", docError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: docError.message
            }, {
                status: 500
            });
        }
        // Chunk the text
        const textChunks = chunkText(extractedText);
        // Store chunks
        if (textChunks.length > 0) {
            const chunkRows = textChunks.map((content, index)=>({
                    document_id: doc.id,
                    content,
                    chunk_index: index,
                    token_count: estimateTokens(content),
                    metadata: {
                        source: fileName,
                        page: null
                    }
                }));
            const { error: chunkError } = await supabase.from("document_chunks").insert(chunkRows);
            if (chunkError) {
                console.error("[documents/upload] Chunk insert error:", chunkError);
                // Mark document as error
                await supabase.from("documents").update({
                    status: "error",
                    error_message: chunkError.message
                }).eq("id", doc.id);
                return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Failed to process document chunks"
                }, {
                    status: 500
                });
            }
        }
        // Mark as ready
        const { data: updated, error: updateError } = await supabase.from("documents").update({
            status: "ready",
            chunk_count: textChunks.length
        }).eq("id", doc.id).select().single();
        if (updateError) {
            console.error("[documents/upload] Status update error:", updateError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            document: updated || doc,
            chunks: textChunks.length,
            textLength: extractedText.length
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        console.error("[documents/upload] error:", message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ce450dd1._.js.map