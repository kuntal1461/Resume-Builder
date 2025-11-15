from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..entity.ResumeTemplateEntity import ResumeTemplateEntity
from ..enums import TemplateState


class ResumeTemplateRepository:
    """Persistence helpers for resume_template rows."""

    def __init__(self, session: Session):
        self._session = session

    def create_template(
        self,
        *,
        title: str,
        category_id: int,
        owner_admin_id: int,
        status: int,
        owner_email: str,
    ) -> ResumeTemplateEntity:
        entity = ResumeTemplateEntity(
            title=title,
            category_id=category_id,
            owner_admin_id=owner_admin_id,
            status=status,
        )
        entity.loggedBy = owner_admin_id
        entity.lastUpdatedBy = owner_admin_id
        self._session.add(entity)
        self._session.flush()
        return entity

    def list_templates_by_status(
        self, status: TemplateState
    ) -> List[ResumeTemplateEntity]:
        stmt = (
            select(ResumeTemplateEntity)
            .where(ResumeTemplateEntity.status == int(status))
            .where(ResumeTemplateEntity.rowstate == 1)
            .order_by(ResumeTemplateEntity.lastUpdateTime.desc())
        )
        result = self._session.execute(stmt)
        return list(result.scalars().all())

    def find_by_id(self, template_id: int) -> Optional[ResumeTemplateEntity]:
        return self._session.get(ResumeTemplateEntity, template_id)
