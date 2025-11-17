from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.RequestVo.SaveResumeDraftRequestVO import SaveResumeDraftRequestVO
from core.ServiceImpl.UserResumeServiceImpl import UserResumeServiceImpl
from core.repository.userResumeRepository import UserResumeRepository
from core.repository.userResumeVersionRepository import UserResumeVersionRepository
from core.responseVO.UserResumeDraftResponseVO import UserResumeDraftResponseVO
from core.service.UserResumeService import UserResumeService
from ..database import get_db
from ..security import get_current_user

router = APIRouter(prefix="/workspace/resumes", tags=["workspace-resumes"])


def get_resume_service(db: Session = Depends(get_db)) -> UserResumeService:
    resume_repo = UserResumeRepository(db)
    version_repo = UserResumeVersionRepository(db)
    return UserResumeServiceImpl(db, resume_repo, version_repo)


class SaveResumeDraftBody(BaseModel):
    templateId: int = Field(..., ge=1)
    title: str = Field(..., min_length=1, max_length=200)
    latexSource: str = Field(..., min_length=1)
    targetRole: Optional[str] = Field(default=None, max_length=200)
    summary: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None)
    templateVersionId: Optional[int] = Field(default=None, ge=1)
    templateVersionNumber: Optional[int] = Field(default=None, ge=0)
    templateVersionLabel: Optional[str] = Field(default=None, max_length=100)


@router.post("/draft", status_code=status.HTTP_201_CREATED)
def save_resume_draft(
    body: SaveResumeDraftBody,
    service: UserResumeService = Depends(get_resume_service),
    current_user=Depends(get_current_user),
):
    request = SaveResumeDraftRequestVO(
        user_id=current_user.id,
        template_id=body.templateId,
        title=body.title.strip(),
        latex_source=body.latexSource,
        target_role=body.targetRole.strip() if body.targetRole else None,
        summary=body.summary.strip() if body.summary else None,
        notes=body.notes.strip() if body.notes else None,
        template_version_id=body.templateVersionId,
        template_version_number=body.templateVersionNumber,
        template_version_label=body.templateVersionLabel.strip() if body.templateVersionLabel else None,
    )

    response = service.save_resume_draft(request)
    return {
        "success": response.success,
        "message": response.message,
        "resumeId": response.resume_id,
        "resumeVersionId": response.resume_version_id,
        "savedAt": response.saved_at.isoformat(),
    }


@router.get("/draft")
def get_resume_draft(
    templateId: int = Query(..., ge=1),
    service: UserResumeService = Depends(get_resume_service),
    current_user=Depends(get_current_user),
):
    draft: Optional[UserResumeDraftResponseVO] = service.get_resume_draft(current_user.id, templateId)
    if not draft:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No saved draft found for this template.")

    return {
        "resumeId": draft.resume_id,
        "resumeVersionId": draft.resume_version_id,
        "templateId": draft.template_id,
        "title": draft.title,
        "latexSource": draft.latex_source,
        "targetRole": draft.target_role,
        "summary": draft.summary,
        "notes": draft.notes,
        "savedAt": draft.saved_at.isoformat(),
    }
