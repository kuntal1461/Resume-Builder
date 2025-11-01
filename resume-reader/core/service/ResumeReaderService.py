from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..requestVO.ResumeReaderRequestVO import ResumeReaderRequestVO
    from ..responseVO.ResumeReaderResponseVO import ResumeReaderResponseVO


class ResumeReaderService(ABC):
    """Contract for services that can parse resumes and return structured data."""

    @abstractmethod
    def read_resume(self, request: "ResumeReaderRequestVO") -> "ResumeReaderResponseVO":
        """Process the uploaded resume and return structured metadata."""
        raise NotImplementedError
