"""Lightweight Supabase PostgREST client using httpx (no heavy SDK)."""

from __future__ import annotations
import httpx
from app.config import get_settings


class SupabaseClient:
    """Thin wrapper around the Supabase PostgREST API."""

    def __init__(self):
        s = get_settings()
        self.url = s.supabase_url
        self.key = s.supabase_service_role_key or s.supabase_anon_key
        self.rest_url = f"{self.url}/rest/v1"
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(headers=self.headers, timeout=30)

    async def select(
        self, table: str, columns: str = "*", filters: dict | None = None,
        order: str | None = None, limit: int | None = None, single: bool = False,
    ) -> list[dict] | dict | None:
        params: dict[str, str] = {"select": columns}
        if filters:
            for k, v in filters.items():
                params[k] = f"eq.{v}"
        if order:
            desc = order.startswith("-")
            col = order.lstrip("-")
            params["order"] = f"{col}.desc" if desc else f"{col}.asc"
        if limit:
            params["limit"] = str(limit)

        headers = dict(self.headers)
        if single:
            headers["Accept"] = "application/vnd.pgrst.object+json"

        async with self._client() as c:
            r = await c.get(f"{self.rest_url}/{table}", params=params, headers=headers)
            r.raise_for_status()
            return r.json()

    async def insert(self, table: str, data: dict | list[dict]) -> list[dict]:
        async with self._client() as c:
            r = await c.post(f"{self.rest_url}/{table}", json=data)
            r.raise_for_status()
            return r.json()

    async def update(self, table: str, data: dict, filters: dict) -> list[dict]:
        params: dict[str, str] = {}
        for k, v in filters.items():
            params[k] = f"eq.{v}"
        async with self._client() as c:
            r = await c.patch(f"{self.rest_url}/{table}", params=params, json=data)
            r.raise_for_status()
            return r.json()

    async def delete(self, table: str, filters: dict) -> None:
        params: dict[str, str] = {}
        for k, v in filters.items():
            params[k] = f"eq.{v}"
        async with self._client() as c:
            r = await c.delete(f"{self.rest_url}/{table}", params=params)
            r.raise_for_status()

    async def ilike_search(
        self, table: str, column: str, pattern: str,
        columns: str = "*", filters: dict | None = None,
        order: str | None = None, limit: int | None = None,
    ) -> list[dict]:
        params: dict[str, str] = {"select": columns, column: f"ilike.%{pattern}%"}
        if filters:
            for k, v in filters.items():
                params[k] = f"eq.{v}"
        if order:
            desc = order.startswith("-")
            col = order.lstrip("-")
            params["order"] = f"{col}.desc" if desc else f"{col}.asc"
        if limit:
            params["limit"] = str(limit)
        async with self._client() as c:
            r = await c.get(f"{self.rest_url}/{table}", params=params)
            r.raise_for_status()
            return r.json()

    async def in_filter(
        self, table: str, column: str, values: list[str],
        columns: str = "*", extra_filters: dict | None = None,
        limit: int | None = None,
    ) -> list[dict]:
        params: dict[str, str] = {
            "select": columns,
            column: f"in.({','.join(values)})",
        }
        if extra_filters:
            for k, v in extra_filters.items():
                params[k] = f"eq.{v}"
        if limit:
            params["limit"] = str(limit)
        async with self._client() as c:
            r = await c.get(f"{self.rest_url}/{table}", params=params)
            r.raise_for_status()
            return r.json()


def get_supabase() -> SupabaseClient:
    return SupabaseClient()
