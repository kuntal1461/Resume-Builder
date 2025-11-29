"""Enum values for scrape type settings."""

from enum import IntEnum


class ScrapeType(IntEnum):
    """Long-backed enum for job_source.scrape_type."""

    def __new__(cls, value: int, label: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj

    def __str__(self) -> str:  # pragma: no cover - trivial helper
        return self.label

    HTML = (1000, "HTML")
    API = (1001, "API")
