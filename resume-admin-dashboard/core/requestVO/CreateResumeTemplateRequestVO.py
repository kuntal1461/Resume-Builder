from dataclasses import dataclass

from ..enums import TemplateState


@dataclass(frozen=True)
class CreateResumeTemplateRequestVO:
    """Payload describing how a resume template should be persisted."""

    title: str
    owner_email: str
    parent_category_slug: str
    child_category_slug: str
    version_label: str
    version_number: int
    latex_source: str
    status: TemplateState
