class ResumeReaderError(Exception):
    """Base exception for resume reader failures."""


class UnsupportedResumeFormatError(ResumeReaderError):
    """Raised when the submitted file type cannot be parsed."""


class ResumeExtractionError(ResumeReaderError):
    """Raised when text extraction or analysis fails."""
