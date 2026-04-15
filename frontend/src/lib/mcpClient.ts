/**
 * mcpClient.ts — Frontend MCP client
 *
 * All calls go through /api/mcp which proxies to the Playwright MCP server
 * (@playwright/mcp) running as a local stdio process.
 *
 * Works in browser and server components without spawning child processes.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface McpTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}

export interface McpResource {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}

export interface McpResourceContent {
    uri: string;
    mimeType: string;
    content: string;
}

export interface McpCallResult {
    content: Array<
        | { type: "text"; text: string }
        | { type: "image"; data: string; mimeType: string }
    >;
    isError?: boolean;
}

// ── Base request ───────────────────────────────────────────────────────────

const BASE = typeof window !== "undefined" ? "" : "http://localhost:3000";

async function mcpPost<T>(method: string, params?: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${BASE}/api/mcp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, params }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `MCP request failed (${res.status})`);
    }
    return res.json();
}

// ── Public API ─────────────────────────────────────────────────────────────

/** List all tools available from the Playwright MCP server */
export async function listTools(): Promise<McpTool[]> {
    const data = await mcpPost<{ tools: McpTool[] }>("tools/list");
    return data.tools ?? [];
}

/** Call a Playwright MCP tool by name */
export async function callTool(
    name: string,
    callParams: Record<string, unknown>
): Promise<McpCallResult> {
    const data = await mcpPost<{ result: McpCallResult }>("tools/call", {
        name,
        arguments: callParams,
    });
    return data.result;
}

/** List all resources exposed by the MCP server */
export async function listResources(): Promise<McpResource[]> {
    const data = await mcpPost<{ resources: McpResource[] }>("resources/list");
    return data.resources ?? [];
}

/** Read the content of a resource by URI */
export async function getResource(uri: string): Promise<McpResourceContent> {
    const data = await mcpPost<{ contents: McpResourceContent[] }>("resources/read", { uri });
    const first = data.contents?.[0];
    if (!first) throw new Error(`No content for resource: ${uri}`);
    return first;
}

/** Helper: get a single tool definition by name */
export async function getTool(name: string): Promise<McpTool | undefined> {
    const tools = await listTools();
    return tools.find((t) => t.name === name);
}

const mcpClient = { listTools, callTool, listResources, getResource, getTool };
export default mcpClient;
