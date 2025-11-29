"""Repository helpers for job_source rows."""

from typing import List, Optional

from sqlalchemy.orm import Session

from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName


class JobSourceRepository:
    """Encapsulates read helpers for job sources."""

    def __init__(self, session: Session):
        self._session = session

    def create(self, source: JobSourceEntity) -> JobSourceEntity:
        self._session.add(source)
        self._session.commit()
        self._session.refresh(source)
        return source

    def list_sources(self, *, only_enabled: bool = True) -> List[JobSourceEntity]:
        query = self._session.query(JobSourceEntity)
        if only_enabled:
            query = query.filter(JobSourceEntity.enabled_for_scrapping.is_(True))
        return list(query.order_by(JobSourceEntity.source_name.asc()).all())

    def find_by_id(self, source_id: int) -> Optional[JobSourceEntity]:
        return self._session.get(JobSourceEntity, source_id)

    def find_by_name(self, source_name: JobSourceName) -> Optional[JobSourceEntity]:
        query = self._session.query(JobSourceEntity).filter(
            JobSourceEntity.source_name == int(source_name)
        )
        return query.first()
