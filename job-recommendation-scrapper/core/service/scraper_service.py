from abc import ABC, abstractmethod
from typing import List, Optional

from core.models import BulkScrapeRequest, JobStatusResponse, ScrapeRequest


class ScraperService(ABC):
    """Defines the scraper service contract."""

    @abstractmethod
    def create_job(self, request: ScrapeRequest) -> str:
        """Queue a new scrape job and return its identifier."""

    @abstractmethod
    def create_bulk_jobs(self, request: BulkScrapeRequest) -> List[str]:
        """Queue multiple scrape jobs and return their identifiers."""

    @abstractmethod
    def get_job_status(self, job_id: str) -> Optional[JobStatusResponse]:
        """Fetch the status of a job if it exists."""

    @abstractmethod
    def cancel_job(self, job_id: str) -> bool:
        """Cancel a pending job; returns True when successful."""
