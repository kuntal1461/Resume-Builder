from typing import Optional

from sqlalchemy.orm import Session

from core.entity.JobRawScrapeEntity import JobRawScrapeEntity
from core.enums import JobRawScrapeStatus


class JobRawScrapeRepository:
    """Persistence helpers for job_raw_scrape rows."""

    def __init__(self, session: Session):
        self._session = session

    # Creation/updates are performed via services; repository exposes read helpers only.

    def fetch_latest_successful_by_url(
        self,
        job_url: str,
    ) -> Optional[JobRawScrapeEntity]:
        query = (
            self._session.query(JobRawScrapeEntity)
            .filter(JobRawScrapeEntity.job_url == job_url)
            .filter(JobRawScrapeEntity.status == int(JobRawScrapeStatus.SUCCESS))
            .order_by(JobRawScrapeEntity.loggedInTime.desc())
        )
        return query.first()
