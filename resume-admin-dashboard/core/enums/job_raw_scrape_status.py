"""Enum for raw scrape lifecycle status values."""

from enum import IntEnum


class JobRawScrapeStatus(IntEnum):
    """Matches rows in job_raw_scrape_status_enum table."""

    def __new__(cls, value: int, label: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.label

    SUCCESS = (1000, "SUCCESS")
    ERROR = (1001, "ERROR")
