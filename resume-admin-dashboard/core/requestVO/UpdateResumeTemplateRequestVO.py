from dataclasses import dataclass

from ..enums import TemplateState


@dataclass(frozen=True)
class UpdateResumeTemplateRequestVO:
    """Payload describing how an existing template should be updated."""

    title: str
    owner_email: str
    parent_category_slug: str
    child_category_slug: str
    version_label: str
    version_number: int
    latex_source: str
    status: TemplateState
