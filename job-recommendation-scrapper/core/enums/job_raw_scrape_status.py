"""Enum for raw scrape lifecycle status values."""

from enum import IntEnum


class JobRawScrapeStatus(IntEnum):
    """Represents allowed states for entries in job_raw_scrape."""

    def __new__(cls, value: int, label: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj

    def __str__(self) -> str:  # pragma: no cover - trivial formatting helper
        return self.label

    SUCCESS = (1000, "SUCCESS")
    ERROR = (1001, "ERROR")
