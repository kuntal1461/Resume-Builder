from datetime import datetime
from typing import Dict, Optional

from sqlalchemy.orm import Session

from core.RequestVo.SaveResumeDraftRequestVO import SaveResumeDraftRequestVO
from core.entity.UserResumeEntity import UserResumeEntity
from core.entity.UserResumeVersionEntity import UserResumeVersionEntity
from core.repository.userResumeRepository import UserResumeRepository
from core.repository.userResumeVersionRepository import UserResumeVersionRepository
from core.responseVO.SaveResumeDraftResponseVO import SaveResumeDraftResponseVO
from core.responseVO.UserResumeDraftResponseVO import UserResumeDraftResponseVO
from core.service.UserResumeService import UserResumeService


class UserResumeServiceImpl(UserResumeService):
    def __init__(
        self,
        db_session: Session,
        resume_repo: UserResumeRepository,
        version_repo: UserResumeVersionRepository,
    ) -> None:
        self.db_session = db_session
        self.resume_repo = resume_repo
        self.version_repo = version_repo

    def save_resume_draft(self, req: SaveResumeDraftRequestVO) -> SaveResumeDraftResponseVO:
        resume = self.resume_repo.get_by_user_and_template(req.user_id, req.template_id)

        if not resume:
            resume = UserResumeEntity(
                user_id=req.user_id,
                template_id=req.template_id,
                title=req.title,
                user_template_version_no=req.template_version_number,
                current_template_version_id=req.template_version_id,
            )
        else:
            resume.title = req.title
            resume.user_template_version_no = req.template_version_number
            resume.current_template_version_id = req.template_version_id

        saved_resume = self.resume_repo.save(resume)

        structured_payload: Dict[str, Optional[str | int]] = {
            "targetRole": req.target_role,
            "summary": req.summary,
            "notes": req.notes,
            "templateVersionLabel": req.template_version_label,
            "templateVersionNumber": req.template_version_number,
        }

        version_entity = UserResumeVersionEntity(
            user_resume_id=saved_resume.id,
            latex_source_snapshot=req.latex_source,
            structured_data_json=structured_payload,
        )
        saved_version = self.version_repo.create(version_entity)

        timestamp = saved_version.lastUpdateTime or saved_version.loggedInTime or datetime.utcnow()

        return SaveResumeDraftResponseVO(
            success=True,
            message="Draft saved successfully.",
            resume_id=saved_resume.id,
            resume_version_id=saved_version.id,
            saved_at=timestamp,
        )

    def get_resume_draft(self, user_id: int, template_id: int) -> Optional[UserResumeDraftResponseVO]:
        resume = self.resume_repo.get_by_user_and_template(user_id, template_id)
        if not resume:
            return None

        latest_version = self.version_repo.get_latest_for_resume(resume.id)
        if not latest_version:
            return None

        structured_data = latest_version.structured_data_json or {}
        target_role = self._safe_str(structured_data.get("targetRole"))
        summary = self._safe_str(structured_data.get("summary"))
        notes = self._safe_str(structured_data.get("notes"))

        timestamp = latest_version.lastUpdateTime or latest_version.loggedInTime or datetime.utcnow()

        return UserResumeDraftResponseVO(
            resume_id=resume.id,
            resume_version_id=latest_version.id,
            template_id=resume.template_id,
            title=resume.title,
            latex_source=latest_version.latex_source_snapshot or "",
            target_role=target_role,
            summary=summary,
            notes=notes,
            saved_at=timestamp,
        )

    @staticmethod
    def _safe_str(value) -> Optional[str]:
        if value is None:
            return None
        if isinstance(value, str):
            return value
        return str(value)
