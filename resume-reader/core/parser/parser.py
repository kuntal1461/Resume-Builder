import io
from pathlib import Path

from .exceptions import ResumeExtractionError, UnsupportedResumeFormatError


def _read_pdf(file_bytes: bytes) -> str:
    try:
        from PyPDF2 import PdfReader  # type: ignore import-not-found
    except ImportError as exc:
        raise ResumeExtractionError(
            "Missing PyPDF2 dependency required for PDF resume extraction."
        ) from exc

    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text_chunks = []
        for page in reader.pages:
            extracted = page.extract_text() or ""
            text_chunks.append(extracted)
        return "\n".join(chunk.strip() for chunk in text_chunks if chunk)
    except Exception as exc:  # noqa: BLE001
        raise ResumeExtractionError("Failed to extract text from PDF resume.") from exc


def _read_docx(file_bytes: bytes) -> str:
    try:
        from docx import Document  # type: ignore import-not-found
    except ImportError as exc:
        raise ResumeExtractionError(
            "Missing python-docx dependency required for DOCX resume extraction."
        ) from exc

    try:
        document = Document(io.BytesIO(file_bytes))
        paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
        return "\n".join(paragraphs)
    except Exception as exc:  # noqa: BLE001
        raise ResumeExtractionError("Failed to extract text from DOCX resume.") from exc


def _read_plain_text(file_bytes: bytes) -> str:
    for encoding in ("utf-8", "latin-1"):
        try:
            return file_bytes.decode(encoding)
        except UnicodeDecodeError:
            continue
    return file_bytes.decode("utf-8", errors="ignore")


def extract_text(filename: str, file_bytes: bytes) -> str:
    extension = Path(filename or "").suffix.lower()

    if extension == ".pdf":
        return _read_pdf(file_bytes)
    if extension in {".docx", ".doc"}:
        return _read_docx(file_bytes)
    if extension in {".txt", ".md"}:
        return _read_plain_text(file_bytes)

    if not extension:
        raise UnsupportedResumeFormatError("Unable to determine resume file type.")

    raise UnsupportedResumeFormatError(f"Unsupported resume format: {extension}")
