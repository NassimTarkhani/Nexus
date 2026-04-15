import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * POST /api/image-gen
 * Body: { prompt: string; provider: "openai" | "gemini"; size?: string; quality?: string; style?: string }
 *
 * OpenAI DALL·E 3 — uses the OPENROUTER_API_KEY from env or x-openai-api-key header
 * Gemini Imagen 3 — uses GEMINI_API_KEY env var or x-gemini-api-key header
 */
export async function POST(req: NextRequest) {
    let body: {
        prompt?: string;
        provider?: "openai" | "gemini";
        size?: string;
        quality?: "standard" | "hd";
        style?: "vivid" | "natural";
    };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { prompt, provider = "openai", size = "1024x1024", quality = "standard", style = "vivid" } = body;

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Missing required field: prompt" }, { status: 400 });
    }

    try {
        if (provider === "gemini") {
            return await generateWithGemini(prompt, req);
        }
        return await generateWithOpenAI(prompt, size, quality, style, req);
    } catch (err: any) {
        console.error("[image-gen] error:", err);
        return NextResponse.json(
            { error: err?.message || "Image generation failed" },
            { status: 500 }
        );
    }
}

// ── OpenAI DALL·E 3 ────────────────────────────────────────────────────────

async function generateWithOpenAI(
    prompt: string,
    size: string,
    quality: "standard" | "hd",
    style: "vivid" | "natural",
    req: NextRequest
) {
    const apiKey =
        req.headers.get("x-openai-api-key") || process.env.OPENAI_API_KEY || null;

    if (!apiKey) {
        return NextResponse.json(
            { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env or pass x-openai-api-key header." },
            { status: 401 }
        );
    }

    const client = new OpenAI({ apiKey });

    const validSizes = ["1024x1024", "1792x1024", "1024x1792"] as const;
    const dalleSize = validSizes.includes(size as typeof validSizes[number])
        ? (size as typeof validSizes[number])
        : "1024x1024";

    const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: dalleSize,
        quality,
        style,
        response_format: "url",
    });

    const url = response.data?.[0]?.url ?? null;
    if (!url) throw new Error("No image URL returned from DALL·E 3");

    return NextResponse.json({
        url,
        prompt,
        provider: "openai",
        model: "dall-e-3",
        size: dalleSize,
        quality,
        style,
        generated_at: new Date().toISOString(),
    });
}

// ── Gemini Imagen 3 ────────────────────────────────────────────────────────

async function generateWithGemini(prompt: string, req: NextRequest) {
    const apiKey =
        req.headers.get("x-gemini-api-key") || process.env.GEMINI_API_KEY || null;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env." },
            { status: 401 }
        );
    }

    // Gemini Imagen 3 via REST (generateImages endpoint)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            instances: [{ prompt }],
            parameters: { sampleCount: 1 },
        }),
    });

    if (!geminiRes.ok) {
        const e = await geminiRes.json().catch(() => ({}));
        throw new Error(e?.error?.message || `Gemini responded ${geminiRes.status}`);
    }

    const data = await geminiRes.json();
    const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) throw new Error("No image data in Gemini response");

    // Return as data URL (base64 PNG)
    const dataUrl = `data:image/png;base64,${b64}`;

    return NextResponse.json({
        url: dataUrl,
        prompt,
        provider: "gemini",
        model: "imagen-3.0-generate-001",
        generated_at: new Date().toISOString(),
    });
}
