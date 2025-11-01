from dataclasses import asdict
from pathlib import Path
import sys

from fastapi import APIRouter, File, HTTPException, UploadFile, status

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from core import (  # noqa: E402
    ResumeReaderRequestVO,
    ResumeReaderResponseVO,
    ResumeReaderServiceImpl,
)
from core.exceptions import (  # noqa: E402
    ResumeExtractionError,
    UnsupportedResumeFormatError,
)

router = APIRouter(prefix="/resume-reader", tags=["resume-reader"])
service = ResumeReaderServiceImpl()


@router.post("/extract")
async def extract_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unable to read uploaded resume.") from exc

    try:
        request = ResumeReaderRequestVO(filename=file.filename or "", file_bytes=content)
        response: ResumeReaderResponseVO = service.read_resume(request)
        return asdict(response)
    except UnsupportedResumeFormatError as exc:
        raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, str(exc)) from exc
    except ResumeExtractionError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
