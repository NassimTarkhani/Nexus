import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * /api/mcp  — Proxy API route for the Playwright MCP server
 *
 * The Playwright MCP server (@playwright/mcp) runs as a local stdio process.
 * This route spawns it on demand, executes the requested MCP method, and
 * returns the result as JSON.
 *
 * Supported methods:
 *   tools/list                        → list all available tools
 *   tools/call  { name, arguments }   → call a specific tool
 *   resources/list                    → list resources
 *   resources/read { uri }            → read a resource
 *
 * The route runs in the Node.js runtime (not edge) because it needs spawn.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Types ──────────────────────────────────────────────────────────────────

interface McpRequest {
    method: "tools/list" | "tools/call" | "resources/list" | "resources/read";
    params?: Record<string, unknown>;
}

// ── Client factory ─────────────────────────────────────────────────────────

async function createPlaywrightMcpClient(): Promise<Client> {
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["@playwright/mcp", "--headless"],
        env: Object.fromEntries(
            Object.entries(process.env).filter((e): e is [string, string] => e[1] !== undefined)
        ),
    });

    const client = new Client(
        { name: "nexus-frontend", version: "1.0.0" },
        { capabilities: {} }
    );

    await client.connect(transport);
    return client;
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    let body: McpRequest;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { method, params = {} } = body;

    if (!method) {
        return NextResponse.json({ error: "Missing `method` field" }, { status: 400 });
    }

    let client: Client | null = null;
    try {
        client = await createPlaywrightMcpClient();

        switch (method) {
            case "tools/list": {
                const result = await client.listTools();
                return NextResponse.json({ tools: result.tools });
            }

            case "tools/call": {
                const { name, arguments: callArgs } = params as {
                    name: string;
                    arguments: Record<string, unknown>;
                };
                if (!name) {
                    return NextResponse.json({ error: "Missing tool name" }, { status: 400 });
                }
                const result = await client.callTool({ name, arguments: callArgs ?? {} });
                return NextResponse.json({ result });
            }

            case "resources/list": {
                const result = await client.listResources();
                return NextResponse.json({ resources: result.resources });
            }

            case "resources/read": {
                const { uri } = params as { uri: string };
                if (!uri) {
                    return NextResponse.json({ error: "Missing resource URI" }, { status: 400 });
                }
                const result = await client.readResource({ uri });
                return NextResponse.json({ contents: result.contents });
            }

            default:
                return NextResponse.json({ error: `Unknown method: ${method}` }, { status: 400 });
        }
    } catch (err: any) {
        console.error("[mcp] error:", err);
        return NextResponse.json(
            { error: err?.message || "MCP operation failed" },
            { status: 500 }
        );
    } finally {
        // Always close the client to terminate the spawned Playwright process
        try {
            await client?.close();
        } catch { /* ignore cleanup errors */ }
    }
}
