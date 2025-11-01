from dataclasses import dataclass


@dataclass(frozen=True)
class ResumeReaderRequestVO:
    filename: str
    file_bytes: bytes
