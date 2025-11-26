from datetime import datetime
from typing import Any, Dict

from fastapi import HTTPException

from core.enums.scraper_enums import ScraperStatus
from core.models import (
    BulkScrapeRequest,
    BulkScrapeResponse,
    JobStatusResponse,
    ScrapeRequest,
    ScrapeResponse,
)
from core.service.scraper_service import ScraperService


class ScraperController:
    """Controller layer bridging HTTP handlers and the service layer."""

    def __init__(self, scraper_service: ScraperService):
        self.scraper_service = scraper_service

    async def submit_job(self, request: ScrapeRequest) -> ScrapeResponse:
        try:
            job_id = self.scraper_service.create_job(request)
            return ScrapeResponse(
                job_id=job_id,
                status=ScraperStatus.PENDING,
                message="Job submitted successfully",
                created_at=datetime.utcnow(),
            )
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc

    async def submit_bulk_job(self, request: BulkScrapeRequest) -> BulkScrapeResponse:
        try:
            job_ids = self.scraper_service.create_bulk_jobs(request)
            return BulkScrapeResponse(
                job_ids=job_ids,
                total_jobs=len(job_ids),
                status=ScraperStatus.PENDING,
                message=f"Submitted {len(job_ids)} jobs",
                created_at=datetime.utcnow(),
            )
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc

    async def get_job_status(self, job_id: str) -> JobStatusResponse:
        status = self.scraper_service.get_job_status(job_id)
        if not status:
            raise HTTPException(status_code=404, detail="Job not found")
        return status

    async def cancel_job(self, job_id: str) -> Dict[str, Any]:
        success = self.scraper_service.cancel_job(job_id)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to cancel job")
        return {"job_id": job_id, "cancelled": True, "message": "Job cancelled successfully"}
