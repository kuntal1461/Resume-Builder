from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class SaveResumeDraftResponseVO:
    success: bool
    message: str
    resume_id: int
    resume_version_id: int
    saved_at: datetime
