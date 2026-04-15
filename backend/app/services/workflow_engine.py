"""Workflow execution engine — DAG-based workflow runner.

MVP: Placeholder for Sprint 2 implementation.
Target architecture:
  - Parse workflow_data (React Flow nodes + edges) into a DAG
  - Topological sort for execution order
  - Execute each node sequentially (parallel in later sprint)
  - Support node types: trigger, llm_call, http_request, condition, transform
  - Log node-level execution results
"""

from __future__ import annotations
from typing import Any


class WorkflowEngine:
    """Executes a NEXUS workflow defined as a React Flow graph."""

    def __init__(self, workflow_data: dict[str, Any]):
        self.nodes = workflow_data.get("nodes", [])
        self.edges = workflow_data.get("edges", [])

    def validate(self) -> list[str]:
        """Validate the workflow graph. Returns list of error messages."""
        errors: list[str] = []
        if not self.nodes:
            errors.append("Workflow has no nodes")

        # Check for at least one trigger node
        trigger_nodes = [n for n in self.nodes if n.get("type") == "trigger"]
        if not trigger_nodes:
            errors.append("Workflow must have at least one trigger node")

        # Check for cycles (basic DFS)
        adj: dict[str, list[str]] = {}
        for edge in self.edges:
            src = edge.get("source", "")
            if src not in adj:
                adj[src] = []
            adj[src].append(edge.get("target", ""))

        visited: set[str] = set()
        in_stack: set[str] = set()

        def has_cycle(node: str) -> bool:
            visited.add(node)
            in_stack.add(node)
            for neighbor in adj.get(node, []):
                if neighbor not in visited:
                    if has_cycle(neighbor):
                        return True
                elif neighbor in in_stack:
                    return True
            in_stack.discard(node)
            return False

        for node in self.nodes:
            nid = node.get("id", "")
            if nid not in visited:
                if has_cycle(nid):
                    errors.append("Workflow contains a cycle")
                    break

        return errors

    async def execute(self, input_data: dict[str, Any] | None = None) -> dict[str, Any]:
        """Execute the workflow. Returns execution result."""
        errors = self.validate()
        if errors:
            return {"status": "error", "errors": errors}

        # TODO: Implement full DAG execution
        return {
            "status": "pending",
            "message": "Full DAG execution engine coming in Sprint 2",
            "node_count": len(self.nodes),
            "edge_count": len(self.edges),
        }
