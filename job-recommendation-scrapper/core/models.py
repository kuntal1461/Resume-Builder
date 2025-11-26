from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, HttpUrl

from core.enums.scraper_enums import ScraperStatus, ScraperType


class ScrapeRequest(BaseModel):
    """Represents the payload for creating a scrape job."""

    url: HttpUrl
    scraper_type: ScraperType = ScraperType.REQUESTS
    selectors: Optional[Dict[str, str]] = None
    headers: Optional[Dict[str, str]] = None
    cookies: Optional[Dict[str, str]] = None
    proxy: Optional[str] = None
    javascript_enabled: bool = False
    wait_time: int = Field(default=0, ge=0, le=120)
    max_retries: int = Field(default=3, ge=0, le=10)
    priority: int = Field(default=5, ge=1, le=10)
    metadata: Optional[Dict[str, Any]] = None


class BulkScrapeRequest(BaseModel):
    """Represents the payload for creating multiple scrape jobs."""

    urls: List[HttpUrl]
    batch_size: int = Field(default=5, ge=1, le=100)
    scraper_type: ScraperType = ScraperType.REQUESTS
    selectors: Optional[Dict[str, str]] = None
    headers: Optional[Dict[str, str]] = None
    cookies: Optional[Dict[str, str]] = None
    proxy: Optional[str] = None
    javascript_enabled: bool = False
    wait_time: int = Field(default=0, ge=0, le=120)
    max_retries: int = Field(default=3, ge=0, le=10)
    priority: int = Field(default=5, ge=1, le=10)
    metadata: Optional[Dict[str, Any]] = None


class ScrapeResponse(BaseModel):
    """Response returned after creating a scrape job."""

    job_id: str
    status: ScraperStatus
    message: str
    created_at: datetime


class BulkScrapeResponse(BaseModel):
    """Response returned after creating bulk scrape jobs."""

    job_ids: List[str]
    total_jobs: int
    status: ScraperStatus
    message: str
    created_at: datetime


class JobStatusResponse(BaseModel):
    """Represents the status of a scrape job."""

    job_id: str
    status: str
    result: Optional[Any] = None
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
