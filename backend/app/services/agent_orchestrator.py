"""Agent orchestrator — multi-agent pipeline (planner → executor → reviewer).

MVP: Single-agent execution. Multi-agent orchestration in Sprint 3.
"""

from __future__ import annotations
from typing import Any
from openai import AsyncOpenAI


class AgentOrchestrator:
    """Orchestrates AI agent execution with optional multi-agent pipelines."""

    def __init__(self, api_key: str, base_url: str = "https://openrouter.ai/api/v1"):
        self.client = AsyncOpenAI(api_key=api_key, base_url=base_url)

    async def execute_single(
        self,
        system_prompt: str,
        messages: list[dict[str, str]],
        model: str,
        temperature: float = 0.7,
    ) -> str:
        """Execute a single agent with the given prompt and messages."""
        response = await self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                *messages,
            ],
            temperature=temperature,
        )
        return response.choices[0].message.content or ""

    async def execute_pipeline(
        self,
        agents: list[dict[str, Any]],
        input_message: str,
    ) -> dict[str, Any]:
        """Execute a multi-agent pipeline: planner → executor → reviewer.

        Each agent receives the output of the previous one as context.
        """
        results: list[dict[str, Any]] = []
        current_input = input_message

        for agent in agents:
            name = agent.get("name", "agent")
            system_prompt = agent.get("system_prompt", "You are a helpful assistant.")
            model = agent.get("model", "openai/gpt-oss-120b:free")
            temperature = agent.get("temperature", 0.7)

            output = await self.execute_single(
                system_prompt=system_prompt,
                messages=[{"role": "user", "content": current_input}],
                model=model,
                temperature=temperature,
            )

            results.append({"agent": name, "output": output})
            current_input = f"Previous agent ({name}) output:\n{output}\n\nPlease continue with your task."

        return {
            "status": "completed",
            "pipeline_results": results,
            "final_output": results[-1]["output"] if results else "",
        }
