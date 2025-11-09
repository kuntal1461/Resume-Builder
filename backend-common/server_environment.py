from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Dict, Iterable

_ENV_ALIASES: Dict[str, Iterable[str]] = {
    "local": ("local", "localhost", "dev", "development"),
    "staging": ("stage", "staging", "qa", "test"),
    "production": ("prod", "production", "live"),
}


def _normalize_env_name(raw_value: str | None) -> str:
    value = (raw_value or "local").strip().lower()
    for canonical, aliases in _ENV_ALIASES.items():
        if value == canonical or value in aliases:
            return canonical
    raise ValueError(
        f"Unsupported SERVER_ENV '{raw_value}'. "
        f"Allowed values: {', '.join(sorted(_ENV_ALIASES))}"
    )


@dataclass(frozen=True)
class ServerEnvironment:
    """Container describing the active server environment."""

    name: str

    @property
    def is_local(self) -> bool:
        return self.name == "local"

    @property
    def is_staging(self) -> bool:
        return self.name == "staging"

    @property
    def is_prod(self) -> bool:
        return self.name == "production"

    def as_dict(self) -> Dict[str, str | bool]:
        return {
            "name": self.name,
            "isLocal": self.is_local,
            "isStaging": self.is_staging,
            "isProd": self.is_prod,
        }


@lru_cache(maxsize=1)
def get_server_environment() -> ServerEnvironment:
    """Return a cached ServerEnvironment instance."""
    raw = os.getenv("SERVER_ENV") or os.getenv("APP_ENV")
    normalized = _normalize_env_name(raw)
    return ServerEnvironment(name=normalized)


__all__ = ["ServerEnvironment", "get_server_environment"]

