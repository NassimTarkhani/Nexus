import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 60;

const FREE_MODEL_FALLBACK = "openai/gpt-oss-120b:free";

interface ChatRequest {
    documentId: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    model?: string;
}

export async function POST(req: NextRequest) {
    let body: ChatRequest;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { documentId, messages, model } = body;

    if (!documentId || !messages?.length) {
        return NextResponse.json({ error: "Missing documentId or messages" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const authHeader = req.headers.get("authorization") ?? "";
    const userToken = authHeader.replace(/^Bearer\s+/i, "");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${userToken}` } },
    });

    try {
        // Load document
        const { data: doc, error: docError } = await supabase
            .from("documents")
            .select("id, name, content, file_type")
            .eq("id", documentId)
            .single();

        if (docError || !doc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        // Get the user's latest message for targeted chunk retrieval
        const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");
        const query = latestUserMsg?.content ?? "";

        // Retrieve relevant chunks (simple text matching for MVP)
        let context = "";
        const { data: chunks } = await supabase
            .from("document_chunks")
            .select("content, chunk_index")
            .eq("document_id", documentId)
            .order("chunk_index", { ascending: true });

        if (chunks && chunks.length > 0) {
            // For short documents (<20 chunks), include all content
            if (chunks.length <= 20) {
                context = chunks.map((c) => c.content).join("\n\n");
            } else {
                // For longer documents, find chunks matching the query
                const queryLower = query.toLowerCase();
                const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 3);

                const scored = chunks.map((c) => {
                    const lower = c.content.toLowerCase();
                    let score = 0;
                    for (const word of queryWords) {
                        if (lower.includes(word)) score++;
                    }
                    return { ...c, score };
                });

                // Take top 10 most relevant chunks + first 2 chunks for context
                const firstChunks = chunks.slice(0, 2);
                const topChunks = scored
                    .filter((c) => c.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);

                const selectedIds = new Set<number>();
                for (const c of firstChunks) selectedIds.add(c.chunk_index);
                for (const c of topChunks) selectedIds.add(c.chunk_index);

                const selectedChunks = chunks
                    .filter((c) => selectedIds.has(c.chunk_index))
                    .sort((a, b) => a.chunk_index - b.chunk_index);

                context = selectedChunks.map((c) => c.content).join("\n\n");
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

        const openrouter = createOpenAI({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1",
        });

        const result = await generateText({
            model: openrouter.chat(resolvedModel),
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            temperature: 0.3,
        });

        // Return as SSE format for consistency with the main chat route
        const payload = [
            `data: ${JSON.stringify({ content: result.text ?? "", done: false })}`,
            "data: [DONE]",
            "",
        ].join("\n\n");

        return new Response(payload, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Document chat failed";
        console.error("[documents/chat] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
