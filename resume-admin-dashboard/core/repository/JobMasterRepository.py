from typing import Optional

from sqlalchemy.orm import Session

from core.entity.JobMasterEntity import JobMasterEntity


class JobMasterRepository:
    """Persistence helpers for job_master rows."""

    def __init__(self, session: Session):
        self._session = session

    def find_by_id(self, job_id: int) -> Optional[JobMasterEntity]:
        return self._session.get(JobMasterEntity, job_id)

    def find_by_external_id(
        self,
        *,
        source_id: int,
        external_job_id: str,
    ) -> Optional[JobMasterEntity]:
        query = (
            self._session.query(JobMasterEntity)
            .filter(JobMasterEntity.source_id == source_id)
            .filter(JobMasterEntity.external_job_id == external_job_id)
        )
        return query.first()

    # Creation and update operations are handled in higher-level services.
