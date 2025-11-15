from dataclasses import dataclass


@dataclass(frozen=True)
class CreateResumeTemplateResponseVO:
    """Represents a successful template + version creation."""

    success: bool
    template_id: int
    template_version_id: int
    version_number: int
