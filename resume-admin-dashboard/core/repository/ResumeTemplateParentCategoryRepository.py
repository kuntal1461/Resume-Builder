from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..entity.ResumeTemplateParentCategoryEntity import (
    ResumeTemplateParentCategoryEntity,
)


class ResumeTemplateParentCategoryRepository:
    """Data-access helpers for the resume_template_parent_category_master table."""

    def __init__(self, session: Session):
        self._session = session

    def _base_query(self):
        return select(ResumeTemplateParentCategoryEntity)

    def list_parent_categories(
        self,
        include_inactive: bool = False,
    ) -> List[ResumeTemplateParentCategoryEntity]:
        stmt = self._base_query().order_by(
            ResumeTemplateParentCategoryEntity.sort_order.asc(),
            ResumeTemplateParentCategoryEntity.name.asc(),
        )

        result = self._session.execute(stmt)
        return list(result.scalars().all())

    def find_by_slug(
        self,
        slug: str,
    ) -> Optional[ResumeTemplateParentCategoryEntity]:
        stmt = self._base_query().where(ResumeTemplateParentCategoryEntity.slug == slug)
        result = self._session.execute(stmt)
        return result.scalars().first()

    def find_by_id(
        self,
        parent_id: int,
    ) -> Optional[ResumeTemplateParentCategoryEntity]:
        return self._session.get(ResumeTemplateParentCategoryEntity, parent_id)
