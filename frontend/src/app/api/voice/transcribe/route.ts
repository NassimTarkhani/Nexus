import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * POST /api/voice/transcribe
 * Content-Type: multipart/form-data
 * Field: audio    — WebM/OGG/MP4/WAV audio blob from MediaRecorder
 * Field: language — (optional) BCP-47 language code, e.g. "en"
 *
 * Provider priority:
 *  1. Groq Whisper (GROQ_API_KEY)  — free, fast, whisper-large-v3-turbo
 *  2. OpenAI Whisper-1 (OPENAI_API_KEY or x-openai-api-key header)
 */
export async function POST(req: NextRequest) {
    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: "Expected multipart/form-data body" }, { status: 400 });
    }

    const audioEntry = formData.get("audio");
    if (!audioEntry || typeof audioEntry === "string") {
        return NextResponse.json({ error: "Missing audio field in form data" }, { status: 400 });
    }

    const language = (formData.get("language") as string | null) ?? undefined;

    const groqKey = process.env.GROQ_API_KEY ?? null;
    const openaiKey =
        req.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY || null;

    if (!groqKey && !openaiKey) {
        return NextResponse.json(
            {
                error:
                    "No transcription API key configured. Add GROQ_API_KEY (free at console.groq.com) or OPENAI_API_KEY to .env.",
            },
            { status: 401 }
        );
    }

    const file = new File([audioEntry as Blob], "audio.webm", {
        type: (audioEntry as Blob).type || "audio/webm",
    });

    try {
        if (groqKey) {
            return await transcribeWithGroq(file, language, groqKey);
        }
        return await transcribeWithOpenAI(file, language, openaiKey!);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Transcription failed";
        console.error("[voice/transcribe] error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

async function transcribeWithGroq(
    file: File,
    language: string | undefined,
    apiKey: string
): Promise<Response> {
    const client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
    });

    const transcription = await client.audio.transcriptions.create({
        model: "whisper-large-v3-turbo",
        file,
        ...(language ? { language } : {}),
        response_format: "json",
    });

    return NextResponse.json({ text: transcription.text, provider: "groq" });
}

async function transcribeWithOpenAI(
    file: File,
    language: string | undefined,
    apiKey: string
): Promise<Response> {
    const client = new OpenAI({ apiKey });

    const transcription = await client.audio.transcriptions.create({
        model: "whisper-1",
        file,
        ...(language ? { language } : {}),
        response_format: "json",
    });

    return NextResponse.json({ text: transcription.text, provider: "openai" });
}
