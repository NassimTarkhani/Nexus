/**
 * workflowSerializer.ts — Serialize / deserialize React Flow workflow state
 *
 * Converts a React Flow graph (nodes + edges) to/from a compact JSON
 * representation that is stored in the `user_workflows.definition` JSONB
 * column in Supabase.
 *
 * Version history is embedded so future migrations can be handled gracefully.
 */

import type { Node, Edge } from "@xyflow/react";

// ── Schema version ─────────────────────────────────────────────────────────

export const WORKFLOW_SCHEMA_VERSION = "1.0";

// ── Serialized types ───────────────────────────────────────────────────────

export interface SerializedNode {
    id: string;
    type: string;
    /** Position relative to the canvas origin */
    x: number;
    y: number;
    /** Node-specific configuration data */
    data: Record<string, unknown>;
}

export interface SerializedEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null;
    targetHandle?: string | null;
    /** Edge visual type, e.g. "smoothstep", "straight", "bezier" */
    type?: string;
    label?: string;
    /** Arbitrary edge metadata */
    data?: Record<string, unknown>;
}

export interface WorkflowJSON {
    /** Schema version — used to migrate older definitions */
    version: string;
    /** Human-readable workflow name (optional, can be stored at DB level) */
    name?: string;
    /** ISO timestamp of last serialization */
    serialized_at: string;
    nodes: SerializedNode[];
    edges: SerializedEdge[];
    /** Viewport state (zoom + pan) — optional, stored for UX convenience */
    viewport?: { x: number; y: number; zoom: number };
}

// ── serialize ──────────────────────────────────────────────────────────────

/**
 * Convert React Flow nodes + edges (and optional viewport) into a
 * `WorkflowJSON` object suitable for storing in the database.
 *
 * @example
 * const json = serialize(nodes, edges, { x: 0, y: 0, zoom: 1 });
 * await workflowsService.updateWorkflow(id, { definition: json });
 */
export function serialize(
    nodes: Node[],
    edges: Edge[],
    viewport?: { x: number; y: number; zoom: number },
    name?: string
): WorkflowJSON {
    const serializedNodes: SerializedNode[] = nodes.map((n) => ({
        id: n.id,
        type: n.type ?? "default",
        x: n.position.x,
        y: n.position.y,
        data: (n.data ?? {}) as Record<string, unknown>,
    }));

    const serializedEdges: SerializedEdge[] = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        ...(e.sourceHandle != null ? { sourceHandle: e.sourceHandle } : {}),
        ...(e.targetHandle != null ? { targetHandle: e.targetHandle } : {}),
        ...(e.type ? { type: e.type } : {}),
        ...(e.label ? { label: String(e.label) } : {}),
        ...(e.data ? { data: e.data as Record<string, unknown> } : {}),
    }));

    return {
        version: WORKFLOW_SCHEMA_VERSION,
        ...(name ? { name } : {}),
        serialized_at: new Date().toISOString(),
        nodes: serializedNodes,
        edges: serializedEdges,
        ...(viewport ? { viewport } : {}),
    };
}

// ── deserialize ────────────────────────────────────────────────────────────

interface DeserializedGraph {
    nodes: Node[];
    edges: Edge[];
    viewport?: { x: number; y: number; zoom: number };
}

/**
 * Convert a stored `WorkflowJSON` back into React Flow nodes + edges.
 *
 * Handles unknown schema versions gracefully — older schemas are returned
 * as-is without throwing.
 *
 * @example
 * const { nodes, edges, viewport } = deserialize(row.definition);
 * setNodes(nodes);
 * setEdges(edges);
 */
export function deserialize(json: WorkflowJSON): DeserializedGraph {
    // Future: add migrations here when WORKFLOW_SCHEMA_VERSION bumps
    const nodes: Node[] = json.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: { x: n.x, y: n.y },
        data: n.data,
    }));

    const edges: Edge[] = json.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        ...(e.sourceHandle != null ? { sourceHandle: e.sourceHandle } : {}),
        ...(e.targetHandle != null ? { targetHandle: e.targetHandle } : {}),
        ...(e.type ? { type: e.type } : {}),
        ...(e.label ? { label: e.label } : {}),
        ...(e.data ? { data: e.data } : {}),
    }));

    return {
        nodes,
        edges,
        ...(json.viewport ? { viewport: json.viewport } : {}),
    };
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Return true if `value` looks like a valid `WorkflowJSON` object.
 * Useful before calling `deserialize` on untrusted DB data.
 */
export function isWorkflowJSON(value: unknown): value is WorkflowJSON {
    if (!value || typeof value !== "object") return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.version === "string" &&
        Array.isArray(v.nodes) &&
        Array.isArray(v.edges)
    );
}

/**
 * Stringify a `WorkflowJSON` to a compact JSON string for clipboard / export.
 */
export function toJSONString(json: WorkflowJSON): string {
    return JSON.stringify(json);
}

/**
 * Parse a JSON string back into a `WorkflowJSON` (with validation).
 * Returns `null` if the string is not valid.
 */
export function fromJSONString(str: string): WorkflowJSON | null {
    try {
        const parsed = JSON.parse(str);
        return isWorkflowJSON(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

/**
 * Count nodes and edges in a serialized workflow for display purposes.
 */
export function workflowStats(json: WorkflowJSON): { nodes: number; edges: number } {
    return { nodes: json.nodes.length, edges: json.edges.length };
}
