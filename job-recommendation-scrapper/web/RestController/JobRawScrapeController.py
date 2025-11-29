"""REST endpoints for raw job scrape payloads."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.entity.JobRawScrapeEntity import JobRawScrapeEntity
from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_raw_scrape_status import JobRawScrapeStatus
from core.repository.job_raw_scrape_repository import JobRawScrapeRepository
from core.repository.job_source_repository import JobSourceRepository
from ..database import get_db

router = APIRouter(prefix="/api/raw-scrapes", tags=["job-raw-scrapes"])


class JobRawScrapeResponse(BaseModel):
    id: int
    sourceId: int
    jobUrl: str
    statusCode: Optional[int]
    statusLabel: Optional[str]
    rawContent: Optional[str]
    errorMessage: Optional[str]
    loggedInTime: Optional[datetime]
    lastUpdateTime: Optional[datetime]

    @classmethod
    def from_entity(cls, entity: JobRawScrapeEntity) -> "JobRawScrapeResponse":
        status_label: Optional[str] = None
        if entity.status is not None:
            try:
                status_label = JobRawScrapeStatus(entity.status).label
            except ValueError:
                status_label = str(entity.status)

        return cls(
            id=entity.id,
            sourceId=entity.source_id,
            jobUrl=entity.job_url,
            statusCode=entity.status,
            statusLabel=status_label,
            rawContent=entity.raw_content,
            errorMessage=entity.error_message,
            loggedInTime=entity.loggedInTime,
            lastUpdateTime=entity.lastUpdateTime,
        )


class CreateJobRawScrapeBody(BaseModel):
    sourceId: int = Field(..., ge=1)
    jobUrl: str = Field(..., min_length=5, max_length=2000)
    rawContent: Optional[str] = None
    status: JobRawScrapeStatus = JobRawScrapeStatus.SUCCESS
    errorMessage: Optional[str] = Field(default=None, max_length=5000)


@router.post("", response_model=JobRawScrapeResponse, status_code=status.HTTP_201_CREATED)
def create_job_raw_scrape(
    body: CreateJobRawScrapeBody,
    db: Session = Depends(get_db),
):
    raw_repo = JobRawScrapeRepository(db)
    source_repo = JobSourceRepository(db)
    source: Optional[JobSourceEntity] = source_repo.find_by_id(body.sourceId)
    if not source:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Source does not exist.")

    scrape = JobRawScrapeEntity(
        source_id=body.sourceId,
        job_url=body.jobUrl.strip(),
        raw_content=body.rawContent,
        status=int(body.status),
        error_message=body.errorMessage,
    )
    created = raw_repo.create(scrape)
    return JobRawScrapeResponse.from_entity(created)


@router.get("/latest", response_model=JobRawScrapeResponse)
def fetch_latest_scrape(
    jobUrl: str = Query(..., min_length=5),
    onlySuccessful: bool = Query(default=True),
    db: Session = Depends(get_db),
):
    raw_repo = JobRawScrapeRepository(db)
    scrape = raw_repo.fetch_latest_by_url(jobUrl, only_successful=onlySuccessful)
    if not scrape:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No scrape found for the provided URL.")
    return JobRawScrapeResponse.from_entity(scrape)
