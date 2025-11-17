from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class UserResumeDraftResponseVO:
    resume_id: int
    resume_version_id: int
    template_id: int
    title: str
    latex_source: str
    target_role: Optional[str]
    summary: Optional[str]
    notes: Optional[str]
    saved_at: datetime
