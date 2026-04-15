import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/search?q=query&limit=5
 *
 * Priority:
 *  1. Brave Search API  (BRAVE_SEARCH_API_KEY env var)
 *  2. DuckDuckGo Instant Answer API (free, no key)
 */

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "5", 10), 10);

    if (!query.trim()) {
        return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });
    }

    const braveKey = process.env.BRAVE_SEARCH_API_KEY;

    try {
        if (braveKey) {
            return NextResponse.json(await searchBrave(query, limit, braveKey));
        }
        return NextResponse.json(await searchDuckDuckGo(query, limit));
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Search failed";
        console.error("[api/search]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// ── Brave Search ────────────────────────────────────────────────────────────

async function searchBrave(
    query: string,
    count: number,
    apiKey: string
): Promise<{ results: SearchResult[]; source: string }> {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
    const res = await fetch(url, {
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": apiKey,
        },
    });

    if (!res.ok) {
        throw new Error(`Brave Search API error: ${res.status}`);
    }

    const data = await res.json() as { web?: { results?: Array<{ title: string; url: string; description?: string }> } };
    const items = data.web?.results ?? [];

    return {
        source: "brave",
        results: items.slice(0, count).map((r) => ({
            title: r.title ?? "",
            url: r.url ?? "",
            snippet: r.description ?? "",
        })),
    };
}

// ── DuckDuckGo Instant Answer (free, no key) ────────────────────────────────

async function searchDuckDuckGo(
    query: string,
    count: number
): Promise<{ results: SearchResult[]; source: string }> {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(url, {
        headers: { "User-Agent": "Nexus/1.0 (AI Assistant)" },
    });

    if (!res.ok) {
        throw new Error(`DuckDuckGo API error: ${res.status}`);
    }

    const data = await res.json() as {
        AbstractText?: string;
        AbstractURL?: string;
        AbstractSource?: string;
        RelatedTopics?: Array<{ Text?: string; FirstURL?: string; Name?: string }>;
        Answer?: string;
    };

    const results: SearchResult[] = [];

    // Instant answer / abstract
    if (data.AbstractText) {
        results.push({
            title: data.AbstractSource ?? "Instant Answer",
            url: data.AbstractURL ?? `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            snippet: data.AbstractText,
        });
    }

    if (data.Answer) {
        results.push({
            title: "Direct Answer",
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            snippet: data.Answer,
        });
    }

    // Related topics
    for (const topic of (data.RelatedTopics ?? []).slice(0, count)) {
        if (topic.Text && topic.FirstURL) {
            results.push({
                title: topic.Name ?? topic.Text.split(" - ")[0] ?? "Related",
                url: topic.FirstURL,
                snippet: topic.Text,
            });
        }
    }

    // Ensure we always return something useful
    if (results.length === 0) {
        results.push({
            title: `Search results for "${query}"`,
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            snippet: `No instant answer found. Visit DuckDuckGo for full results: https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        });
    }

    return { source: "duckduckgo", results: results.slice(0, count) };
}
