from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..entity.ResumeTemplateVersionEntity import ResumeTemplateVersionEntity


class ResumeTemplateVersionRepository:
    """Persistence helpers for resume_template_version rows."""

    def __init__(self, session: Session):
        self._session = session

    def create_version(
        self,
        *,
        template_id: int,
        version_no: int,
        latex_source: str,
        version_label: Optional[str] = None,
    ) -> ResumeTemplateVersionEntity:
        entity = ResumeTemplateVersionEntity(
            template_id=template_id,
            version_no=version_no,
            latex_source=latex_source,
        )
        if version_label:
            entity.field1 = version_label
        self._session.add(entity)
        self._session.flush()
        return entity

    def fetch_latest_by_template_id(
        self, template_id: int
    ) -> Optional[ResumeTemplateVersionEntity]:
        stmt = (
            select(ResumeTemplateVersionEntity)
            .where(ResumeTemplateVersionEntity.template_id == template_id)
            .order_by(ResumeTemplateVersionEntity.version_no.desc(), ResumeTemplateVersionEntity.id.desc())
            .limit(1)
        )
        result = self._session.execute(stmt)
        return result.scalars().first()

    def list_by_template_id(
        self, template_id: int
    ) -> List[ResumeTemplateVersionEntity]:
        stmt = (
            select(ResumeTemplateVersionEntity)
            .where(ResumeTemplateVersionEntity.template_id == template_id)
            .order_by(ResumeTemplateVersionEntity.version_no.desc(), ResumeTemplateVersionEntity.id.desc())
        )
        result = self._session.execute(stmt)
        return list(result.scalars().all())
