"""Enum for job employment types."""

from enum import IntEnum


class JobEmploymentType(IntEnum):
    """Matches rows in job_employment_type_enum table."""

    def __new__(cls, value: int, label: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.label = label
        return obj

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.label

    FULL_TIME = (1000, "FULL_TIME")
    CONTRACT = (1001, "CONTRACT")
    FREELANCE = (1002, "FREELANCE")
