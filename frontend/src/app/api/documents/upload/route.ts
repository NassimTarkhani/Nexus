import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const CHUNK_SIZE = 1000;  // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set([
    "application/pdf",
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function chunkText(text: string, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + size, text.length);
        chunks.push(text.slice(start, end));
        start += size - overlap;
        if (start >= text.length) break;
    }
    return chunks;
}

function estimateTokens(text: string): number {
    // Rough estimate: ~4 chars per token for English
    return Math.ceil(text.length / 4);
}

export async function POST(req: NextRequest) {
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: "Expected multipart/form-data body" }, { status: 400 });
    }

    const file = formData.get("file");
    const userId = formData.get("userId") as string | null;

    if (!file || typeof file === "string") {
        return NextResponse.json({ error: "Missing file field" }, { status: 400 });
    }
    if (!userId) {
        return NextResponse.json({ error: "Missing userId field" }, { status: 400 });
    }

    const blob = file as Blob;
    const fileName = (file as File).name || "document";
    const fileType = blob.type || "application/octet-stream";

    if (blob.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.` }, { status: 413 });
    }

    // Create Supabase client authenticated as the requesting user (satisfies RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const authHeader = req.headers.get("authorization") ?? "";
    const userToken = authHeader.replace(/^Bearer\s+/i, "");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${userToken}` } },
    });

    try {
        // Extract text based on file type
        let extractedText = "";

        if (fileType === "application/pdf") {
            const arrayBuf = await blob.arrayBuffer();
            const { extractText } = await import("unpdf");
            const result = await extractText(new Uint8Array(arrayBuf));
            // result.text can be a string or string[] depending on version
            extractedText = Array.isArray(result.text) ? result.text.join("\n\n") : String(result.text ?? "");
        } else if (
            fileType.startsWith("text/") ||
            fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            // For plain text/markdown/csv, read directly
            extractedText = await blob.text();
        } else {
            return NextResponse.json(
                { error: `Unsupported file type: ${fileType}. Supported: PDF, TXT, MD, CSV.` },
                { status: 400 }
            );
        }

        if (!extractedText.trim()) {
            return NextResponse.json({ error: "No text could be extracted from this file." }, { status: 422 });
        }

        // Create document record
        const { data: doc, error: docError } = await supabase
            .from("documents")
            .insert({
                user_id: userId,
                name: fileName,
                file_type: fileType,
                file_size: blob.size,
                content: extractedText,
                status: "processing",
            })
            .select()
            .single();

        if (docError) {
            console.error("[documents/upload] DB insert error:", docError);
            return NextResponse.json({ error: docError.message }, { status: 500 });
        }

        // Chunk the text
        const textChunks = chunkText(extractedText);

        // Store chunks
        if (textChunks.length > 0) {
            const chunkRows = textChunks.map((content, index) => ({
                document_id: doc.id,
                content,
                chunk_index: index,
                token_count: estimateTokens(content),
                metadata: { source: fileName, page: null },
            }));

            const { error: chunkError } = await supabase
                .from("document_chunks")
                .insert(chunkRows);

            if (chunkError) {
                console.error("[documents/upload] Chunk insert error:", chunkError);
                // Mark document as error
                await supabase.from("documents").update({ status: "error", error_message: chunkError.message }).eq("id", doc.id);
                return NextResponse.json({ error: "Failed to process document chunks" }, { status: 500 });
            }
        }

        // Mark as ready
        const { data: updated, error: updateError } = await supabase
            .from("documents")
            .update({ status: "ready", chunk_count: textChunks.length })
            .eq("id", doc.id)
            .select()
            .single();

        if (updateError) {
            console.error("[documents/upload] Status update error:", updateError);
        }

        return NextResponse.json({
            document: updated || doc,
            chunks: textChunks.length,
            textLength: extractedText.length,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        console.error("[documents/upload] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
