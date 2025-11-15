from typing import Dict, Iterable, List, Optional

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
        stmt = self._base_query()
        if not include_inactive:
            stmt = stmt.where(ResumeTemplateParentCategoryEntity.rowstate == 1)

        stmt = stmt.order_by(
            ResumeTemplateParentCategoryEntity.sort_order.asc(),
            ResumeTemplateParentCategoryEntity.name.asc(),
        )

        result = self._session.execute(stmt)
        return list(result.scalars().all())

    def fetch_by_ids(
        self, parent_ids: Iterable[int]
    ) -> Dict[int, ResumeTemplateParentCategoryEntity]:
        id_list = {int(parent_id) for parent_id in parent_ids if parent_id is not None}
        if not id_list:
            return {}

        stmt = self._base_query().where(
            ResumeTemplateParentCategoryEntity.id.in_(id_list)
        )
        result = self._session.execute(stmt)
        return {int(entity.id): entity for entity in result.scalars().all()}

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
