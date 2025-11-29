"""Enum for supported job source providers."""

from enum import IntEnum


class JobSourceName(IntEnum):
    """Matches rows in job_source_name_enum table."""

    def __new__(cls, value: int, label: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj

    def __str__(self) -> str:  # pragma: no cover - trivial helper
        return self.label

    LINKEDIN = (1000, "LinkedIn")
    INDEED = (1001, "Indeed")
    NAUKRI = (1002, "Naukri")
