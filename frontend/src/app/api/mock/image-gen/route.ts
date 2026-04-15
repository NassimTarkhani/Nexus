import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * POST /api/mock/image-gen
 * Body: { prompt: string; size?: string; quality?: string; style?: string }
 *
 * Returns a mock image URL and generation metadata.
 * Replace the `mockGenerate()` call with a real provider (OpenAI DALL-E, etc.)
 * by setting an API key in environment variables and calling the real endpoint.
 */
export async function POST(req: NextRequest) {
    let body: { prompt?: string; size?: string; quality?: string; style?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { prompt, size = "1024x1024", quality = "standard", style = "vivid" } = body;

    if (!prompt?.trim()) {
        return NextResponse.json({ error: "Missing required field: prompt" }, { status: 400 });
    }

    // Simulate generation latency
    await simulateDelay(1500);

    const result = mockGenerate(prompt, size, quality, style);

    return NextResponse.json(result, {
        headers: {
            "Cache-Control": "no-store",
            "X-Mock": "true",
        },
    });
}

// ── Mock generation implementation ────────────────────────────────────────

const MOCK_IMAGES = [
    "https://picsum.photos/seed/ai1/1024/1024",
    "https://picsum.photos/seed/ai2/1024/1024",
    "https://picsum.photos/seed/ai3/1024/1024",
    "https://picsum.photos/seed/ai4/1024/1024",
    "https://picsum.photos/seed/ai5/1024/1024",
];

function mockGenerate(prompt: string, size: string, quality: string, style: string) {
    const seed = Math.abs(hashString(prompt)) % MOCK_IMAGES.length;
    const [w, h] = size.split("x").map(Number);

    return {
        id: `imggen-${Date.now()}`,
        url: `https://picsum.photos/seed/${seed + 1}/${w ?? 1024}/${h ?? 1024}`,
        prompt,
        size,
        quality,
        style,
        provider: "mock",
        generated_at: new Date().toISOString(),
        note: "This is a mock image. Connect a real provider (OpenAI DALL-E 3, Gemini Imagen, etc.) by replacing /api/mock/image-gen.",
    };
}

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
