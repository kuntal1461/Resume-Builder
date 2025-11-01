from ..analyzer import (
    detect_sections,
    detect_skills,
    extract_contacts,
    infer_probable_name,
    summarize,
)
from ..exceptions import ResumeExtractionError
from ..parser import extract_text
from ..requestVO.ResumeReaderRequestVO import ResumeReaderRequestVO
from ..responseVO.ResumeReaderResponseVO import ResumeReaderResponseVO
from ..responseVO.ResumeReaderResponseVO import ResumeReaderResponseVOData
from ..service.ResumeReaderService import ResumeReaderService


class ResumeReaderServiceImpl(ResumeReaderService):
    """Default implementation that parses PDF/DOCX/TXT resumes."""

    def read_resume(self, request: ResumeReaderRequestVO) -> ResumeReaderResponseVO:
        if not request.file_bytes:
            raise ResumeExtractionError("Empty resume file submitted.")

        text = extract_text(request.filename, request.file_bytes)
        if not text.strip():
            raise ResumeExtractionError("Unable to extract readable text from resume.")

        lines = text.splitlines()
        contacts = extract_contacts(text)
        sections = detect_sections(lines)
        skills = detect_skills(text, sections)
        probable_name = infer_probable_name(lines, contacts["emails"])
        summary_lines = summarize(lines)

        payload = ResumeReaderResponseVOData(
            raw_text=text.strip(),
            emails=contacts["emails"],
            phone_numbers=contacts["phones"],
            urls=contacts["urls"],
            skills=skills,
            sections=sections,
            probable_name=probable_name,
            summary=summary_lines,
        )

        return ResumeReaderResponseVO(success=True, data=payload)
