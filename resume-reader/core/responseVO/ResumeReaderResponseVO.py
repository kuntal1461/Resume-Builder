from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ResumeReaderResponseVOData:
    raw_text: str
    emails: List[str] = field(default_factory=list)
    phone_numbers: List[str] = field(default_factory=list)
    urls: List[str] = field(default_factory=list)
    skills: List[str] = field(default_factory=list)
    sections: Dict[str, List[str]] = field(default_factory=dict)
    probable_name: Optional[str] = None
    summary: List[str] = field(default_factory=list)


@dataclass(frozen=True)
class ResumeReaderResponseVO:
    success: bool
    data: ResumeReaderResponseVOData
