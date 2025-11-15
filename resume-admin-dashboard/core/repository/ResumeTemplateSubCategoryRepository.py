from typing import Dict, Iterable, List, Optional

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

    def find_by_slug(
        self,
        slug: str,
    ) -> Optional[ResumeTemplateSubCategoryEntity]:
        stmt = self._base_query().where(ResumeTemplateSubCategoryEntity.slug == slug)
        result = self._session.execute(stmt)
        return result.scalars().first()

    def find_by_id(
        self,
        category_id: int,
    ) -> Optional[ResumeTemplateSubCategoryEntity]:
        return self._session.get(ResumeTemplateSubCategoryEntity, category_id)

    def fetch_by_ids(
        self, category_ids: Iterable[int]
    ) -> Dict[int, ResumeTemplateSubCategoryEntity]:
        id_list = {
            int(category_id)
            for category_id in category_ids
            if category_id is not None
        }
        if not id_list:
            return {}

        stmt = self._base_query().where(
            ResumeTemplateSubCategoryEntity.id.in_(id_list)
        )
        result = self._session.execute(stmt)
        return {int(entity.id): entity for entity in result.scalars().all()}
