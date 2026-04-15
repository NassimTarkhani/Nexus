import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * POST /api/mock/js-executor
 * Body: { code: string; timeout?: number }
 *
 * Returns mock execution output.
 * Replace with a real sandboxed runtime (e.g. Deno Deploy, E2B sandbox, Pyodide).
 */
export async function POST(req: NextRequest) {
    let body: { code?: string; timeout?: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { code } = body;

    if (!code?.trim()) {
        return NextResponse.json({ error: "Missing required field: code" }, { status: 400 });
    }

    await new Promise((r) => setTimeout(r, 400));

    // Mock: detect common patterns and return plausible output
    const output = mockExecute(code);

    return NextResponse.json(
        {
            id: `exec-${Date.now()}`,
            output,
            error: null,
            duration_ms: 12,
            provider: "mock",
            note: "This is a mock executor. Replace with a real sandbox (E2B, Deno, etc.).",
        },
        {
            headers: {
                "Cache-Control": "no-store",
                "X-Mock": "true",
            },
        }
    );
}

function mockExecute(code: string): string {
    const trimmed = code.trim();

    // console.log statements
    const logMatches = [...trimmed.matchAll(/console\.log\((.+?)\)/g)];
    if (logMatches.length > 0) {
        return logMatches
            .map((m) => {
                const arg = m[1].trim();
                // Strip quotes for string literals
                if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
                    return arg.slice(1, -1);
                }
                return `[mock eval] ${arg}`;
            })
            .join("\n");
    }

    // Simple math expression
    if (/^[\d\s+\-*/().]+$/.test(trimmed)) {
        try {
            // Safe arithmetic only — no eval of arbitrary code
            const result = Function(`"use strict"; return (${trimmed})`)();
            return String(result);
        } catch {
            // ignore
        }
    }

    return `[Mock JS Executor]\nExecuted ${trimmed.split("\n").length} line(s) of code.\nReplace /api/mock/js-executor with a real sandbox.`;
}
