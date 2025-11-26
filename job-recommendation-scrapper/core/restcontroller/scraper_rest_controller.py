from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter

from core.controller.scraper_controller import ScraperController
from core.enums.scraper_enums import ScraperStatus
from core.models import (
    BulkScrapeRequest,
    BulkScrapeResponse,
    JobStatusResponse,
    ScrapeRequest,
    ScrapeResponse,
)
from core.service_impl.scraper_service_impl import ScraperServiceImpl

router = APIRouter(prefix="/api", tags=["scraper"])

scraper_controller = ScraperController(ScraperServiceImpl())


@router.post("/scrape", response_model=ScrapeResponse)
async def create_scrape_job(request: ScrapeRequest) -> ScrapeResponse:
    return await scraper_controller.submit_job(request)


@router.post("/scrape/bulk", response_model=BulkScrapeResponse)
async def create_bulk_scrape_jobs(request: BulkScrapeRequest) -> BulkScrapeResponse:
    return await scraper_controller.submit_bulk_job(request)


@router.get("/jobs/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str) -> JobStatusResponse:
    return await scraper_controller.get_job_status(job_id)


@router.delete("/jobs/{job_id}")
async def cancel_job(job_id: str) -> Dict[str, Any]:
    return await scraper_controller.cancel_job(job_id)


@router.get("/jobs")
async def list_jobs() -> Dict[str, Any]:
    return {
        "message": "Job listing not implemented yet",
        "status": ScraperStatus.PENDING,
        "timestamp": datetime.utcnow().isoformat(),
    }
