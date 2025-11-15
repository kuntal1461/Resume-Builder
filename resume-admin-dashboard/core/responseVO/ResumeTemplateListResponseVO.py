from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class ResumeTemplateSummaryResponseVO:
    """Lightweight representation of a resume template for listings."""

    id: int
    title: str
    owner_email: Optional[str]
    owner_name: Optional[str]
    status_code: int
    status_label: str
    last_update_time: Optional[str]
    preview_image_url: Optional[str]


@dataclass(frozen=True)
class ResumeTemplateListResponseVO:
    """Envelope returned to clients when listing resume templates."""

    success: bool
    templates: List[ResumeTemplateSummaryResponseVO] = field(
        default_factory=list
    )
