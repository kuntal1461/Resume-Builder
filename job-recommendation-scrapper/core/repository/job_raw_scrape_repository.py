"""Repository helpers for the job_raw_scrape table."""

from typing import Optional

from sqlalchemy.orm import Session

from core.entity.JobRawScrapeEntity import JobRawScrapeEntity
from core.enums.job_raw_scrape_status import JobRawScrapeStatus


class JobRawScrapeRepository:
    """Encapsulates CRUD helpers for job_raw_scrape rows."""

    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, scrape: JobRawScrapeEntity) -> JobRawScrapeEntity:
        self.db.add(scrape)
        self.db.commit()
        self.db.refresh(scrape)
        return scrape

    def fetch_latest_by_url(
        self,
        job_url: str,
        *,
        only_successful: bool = False,
    ) -> Optional[JobRawScrapeEntity]:
        query = self.db.query(JobRawScrapeEntity).filter(JobRawScrapeEntity.job_url == job_url)
        if only_successful:
            query = query.filter(JobRawScrapeEntity.status == JobRawScrapeStatus.SUCCESS.value)
        query = query.order_by(JobRawScrapeEntity.loggedInTime.desc())
        return query.first()

    def fetch_latest_successful_by_url(self, job_url: str) -> Optional[JobRawScrapeEntity]:
        return self.fetch_latest_by_url(job_url, only_successful=True)
