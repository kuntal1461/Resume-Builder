"""Enum values for scrape scheduling preferences."""

from enum import IntEnum


class ScrapingSchedule(IntEnum):
    """Long-backed enum for job_source.scraping_schedule."""

    def __new__(cls, value: int, label: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj

    def __str__(self) -> str:  # pragma: no cover - trivial helper
        return self.label

    DAILY = (1000, "Daily")
    WEEKLY = (1001, "Weekly")
    MONTHLY = (1002, "Monthly")
