from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SaveResumeDraftRequestVO:
    user_id: int
    template_id: int
    title: str
    latex_source: str
    target_role: Optional[str] = None
    summary: Optional[str] = None
    notes: Optional[str] = None
    template_version_id: Optional[int] = None
    template_version_number: Optional[int] = None
    template_version_label: Optional[str] = None
