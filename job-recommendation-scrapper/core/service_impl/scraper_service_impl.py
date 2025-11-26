from typing import List, Optional, Type

from core.models import BulkScrapeRequest, JobStatusResponse, ScrapeRequest
from core.service.scraper_service import ScraperService
from core.worker.celery_worker import TaskManager


class ScraperServiceImpl(ScraperService):
    """Celery-backed implementation of the scraper service."""

    def __init__(self, task_manager: Type[TaskManager] = TaskManager):
        self.task_manager = task_manager

    def create_job(self, request: ScrapeRequest) -> str:
        return self.task_manager.create_scrape_job(request)

    def create_bulk_jobs(self, request: BulkScrapeRequest) -> List[str]:
        request_dict = request.model_dump(mode="json")
        urls = request_dict.pop("urls", [])
        request_dict.pop("batch_size", None)
        if not urls:
            return []
        return self.task_manager.create_bulk_scrape_job(urls, request_dict)

    def get_job_status(self, job_id: str) -> Optional[JobStatusResponse]:
        status_dict = self.task_manager.get_job_status(job_id)
        if not status_dict:
            return None
        return JobStatusResponse(**status_dict)

    def cancel_job(self, job_id: str) -> bool:
        return bool(self.task_manager.cancel_job(job_id))
