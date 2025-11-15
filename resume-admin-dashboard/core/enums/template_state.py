"""TemplateState enum centralizes allowed resume template statuses."""

from enum import IntEnum


class TemplateState(IntEnum):
    """Expose both numeric value and human-readable status label."""

    def __new__(cls, value: int, status: str):
        obj = int.__new__(cls, value)
        obj._value_ = value
        obj.status = status
        return obj

    ARCHIVE = (10, "Archive")
    DRAFT = (20, "Draft")
    PUBLISHED = (30, "Published")
