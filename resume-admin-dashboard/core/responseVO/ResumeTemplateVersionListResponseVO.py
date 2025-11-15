from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class ResumeTemplateVersionSummaryResponseVO:
    """Lightweight representation of a template version."""

    id: int
    template_id: int
    version_no: int
    version_label: Optional[str]
    last_update_time: Optional[str]


@dataclass(frozen=True)
class ResumeTemplateVersionListResponseVO:
    """Envelope describing the version history for a template."""

    success: bool
    template_id: int
    versions: List[ResumeTemplateVersionSummaryResponseVO] = field(
        default_factory=list
    )
