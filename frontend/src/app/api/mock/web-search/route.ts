import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    source: string;
    published?: string;
}

/**
 * GET /api/mock/web-search?q=query&limit=5
 *
 * Returns realistic mock web search results.
 * Replace this with a real search provider (e.g. Serper, Brave Search, Bing)
 * by swapping the `mockSearch()` function below.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("q") ?? "";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "5", 10), 10);

    if (!query.trim()) {
        return NextResponse.json({ error: "Missing query parameter `q`" }, { status: 400 });
    }

    const results = mockSearch(query, limit);

    return NextResponse.json(
        {
            query,
            total: results.length,
            results,
        },
        {
            headers: {
                "Cache-Control": "no-store",
                "X-Mock": "true",
            },
        }
    );
}

// ── Mock search implementation ─────────────────────────────────────────────

function mockSearch(query: string, limit: number): SearchResult[] {
    const now = new Date().toISOString().split("T")[0];
    const base: SearchResult[] = [
        {
            title: `${query} — Overview and Latest Developments`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, "_"))}`,
            snippet: `${query} is a rapidly evolving field with significant implications across multiple industries. Recent studies suggest growing adoption in enterprise environments.`,
            source: "Wikipedia",
            published: now,
        },
        {
            title: `Top 10 things you need to know about ${query}`,
            url: `https://techcrunch.com/search/${encodeURIComponent(query)}`,
            snippet: `Industry analysts have noted that ${query} adoption grew by 47% year-over-year. Key players are investing heavily in research and development.`,
            source: "TechCrunch",
            published: now,
        },
        {
            title: `${query} Tutorial — A Comprehensive Guide`,
            url: `https://docs.example.com/${encodeURIComponent(query)}`,
            snippet: `Learn everything about ${query} in this step-by-step tutorial. We cover basics through advanced patterns with practical examples.`,
            source: "docs.example.com",
        },
        {
            title: `GitHub — Trending repositories for ${query}`,
            url: `https://github.com/search?q=${encodeURIComponent(query)}&type=repositories`,
            snippet: `Over 12,000 open-source repositories related to ${query}. Top projects include several with over 10k stars.`,
            source: "GitHub",
            published: now,
        },
        {
            title: `${query} — Community Discussion`,
            url: `https://reddit.com/search/?q=${encodeURIComponent(query)}`,
            snippet: `Community members share experiences and tips about ${query}. Upvoted discussions cover best practices, pitfalls to avoid, and recommended tooling.`,
            source: "Reddit",
        },
        {
            title: `${query} vs Alternatives — Performance Comparison 2025`,
            url: `https://blog.example.com/${encodeURIComponent(query)}-comparison`,
            snippet: `A detailed benchmark comparing ${query} against leading alternatives. Results measured across latency, throughput, and developer experience metrics.`,
            source: "blog.example.com",
            published: now,
        },
        {
            title: `${query} — arXiv research papers`,
            url: `https://arxiv.org/search/?query=${encodeURIComponent(query)}`,
            snippet: `543 preprints on arXiv related to ${query}. Most-cited papers focus on scalability, safety, and real-world applications.`,
            source: "arXiv",
        },
        {
            title: `Hacker News — Ask HN: Best resources for ${query}`,
            url: `https://hn.algolia.com/?q=${encodeURIComponent(query)}`,
            snippet: `Practitioners recommend starting with fundamentals before diving into ${query} tooling. Community resources curated by 300+ upvoters.`,
            source: "Hacker News",
        },
        {
            title: `${query} — npm packages`,
            url: `https://www.npmjs.com/search?q=${encodeURIComponent(query)}`,
            snippet: `Find ${query}-related npm packages with weekly download stats and maintenance scores.`,
            source: "npm",
        },
        {
            title: `${query} in 2025 — What's changed`,
            url: `https://medium.com/search?q=${encodeURIComponent(query)}`,
            snippet: `The landscape for ${query} has shifted dramatically. New frameworks and standards have emerged, making 2024 knowledge partially obsolete.`,
            source: "Medium",
            published: now,
        },
    ];

    return base.slice(0, limit);
}
