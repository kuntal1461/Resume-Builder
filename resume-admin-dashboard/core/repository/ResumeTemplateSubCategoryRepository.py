from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..entity.ResumeTemplateSubCategoryEntity import (
    ResumeTemplateSubCategoryEntity,
)


class ResumeTemplateSubCategoryRepository:
    """Data-access helpers for the resume_template_sub_category_master table."""

    def __init__(self, session: Session):
        self._session = session

    def _base_query(self):
        return select(ResumeTemplateSubCategoryEntity)

    def list_sub_categories(
        self,
        *,
        include_inactive: bool = False,
        parent_id: Optional[int] = None,
    ) -> List[ResumeTemplateSubCategoryEntity]:
        if parent_id is None:
            return []

        stmt = (
            self._base_query()
            .where(ResumeTemplateSubCategoryEntity.parent_id == parent_id)
            .order_by(
                ResumeTemplateSubCategoryEntity.sort_order.asc(),
                ResumeTemplateSubCategoryEntity.name.asc(),
            )
        )

        result = self._session.execute(stmt)
        return list(result.scalars().all())
