from typing import List

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
