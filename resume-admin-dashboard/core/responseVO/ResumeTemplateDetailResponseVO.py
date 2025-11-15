from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class ResumeTemplateDetailResponseVO:
    """Detailed view of a template with latest version content."""

    success: bool
    template_id: int
    title: str
    parent_category_slug: Optional[str]
    child_category_slug: Optional[str]
    latex_source: str
    status_code: int
    status_label: str
    owner_email: Optional[str]
    version_number: Optional[int]
    version_label: Optional[str]
