"""REST endpoints for interacting with job sources."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName
from core.enums.scrape_type import ScrapeType
from core.enums.scraping_schedule import ScrapingSchedule
from core.repository.job_source_repository import JobSourceRepository
from core.service import JobSourceService
from core.service_impl import JobSourceServiceImpl
from ..database import get_db

router = APIRouter(prefix="/api/job-sources", tags=["job-sources"])


class JobSourceResponse(BaseModel):
    id: int
    sourceNameId: int = Field(..., ge=1)
    sourceName: str
    sourceUrl: Optional[str]
    enabledForScrapping: bool
    scrapeTypeId: Optional[int]
    scrapeType: Optional[str]
    scrapingScheduleId: Optional[int]
    scrapingSchedule: Optional[str]
    apiEndpoint: Optional[str]
    apiKey: Optional[str]
    companyName: Optional[str]

    @classmethod
    def from_entity(cls, entity: JobSourceEntity) -> "JobSourceResponse":
        label = str(entity.source_name)
        try:
            enum_value = JobSourceName(entity.source_name)
            label = enum_value.label
        except ValueError:
            enum_value = None

        scrape_type_label = None
        scrape_type_id = None
        if entity.scrape_type is not None:
            scrape_type_id = int(entity.scrape_type)
            try:
                scrape_type_label = ScrapeType(scrape_type_id).label
            except ValueError:
                scrape_type_label = None

        schedule_label = None
        schedule_id = None
        if entity.scraping_schedule is not None:
            schedule_id = int(entity.scraping_schedule)
            try:
                schedule_label = ScrapingSchedule(schedule_id).label
            except ValueError:
                schedule_label = None

        return cls(
            id=entity.id,
            sourceNameId=entity.source_name,
            sourceName=label if label else str(entity.source_name),
            sourceUrl=entity.source_url,
            enabledForScrapping=entity.enabled_for_scrapping,
            scrapeTypeId=scrape_type_id,
            scrapeType=scrape_type_label,
            scrapingScheduleId=schedule_id,
            scrapingSchedule=schedule_label,
            apiEndpoint=entity.api_endpoint,
            apiKey=entity.api_key,
            companyName=getattr(entity, "field1", None),
        )


class CreateJobSourceBody(BaseModel):
    sourceName: JobSourceName
    sourceUrl: Optional[str] = Field(default=None, max_length=2000)
    enabledForScrapping: bool = True
    scrapeTypeId: Optional[int] = Field(default=None, ge=1)
    scrapingScheduleId: Optional[int] = Field(default=None, ge=1)
    apiEndpoint: Optional[str] = Field(default=None, max_length=500)
    apiKey: Optional[str] = Field(default=None, max_length=500)
    companyName: Optional[str] = Field(default=None, max_length=255)


def get_service(db: Session = Depends(get_db)) -> JobSourceService:
    repo = JobSourceRepository(db)
    return JobSourceServiceImpl(repo)


@router.get("", response_model=List[JobSourceResponse])
def list_job_sources(
    includeDisabled: bool = Query(default=False),
    service: JobSourceService = Depends(get_service),
):
    sources = service.list_sources(only_enabled=not includeDisabled)
    return [JobSourceResponse.from_entity(source) for source in sources]


@router.get("/{source_id}", response_model=JobSourceResponse)
def fetch_job_source(source_id: int, service: JobSourceService = Depends(get_service)):
    entity = service.fetch_by_id(source_id)
    if not entity:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Job source not found.")
    return JobSourceResponse.from_entity(entity)


@router.post("", response_model=JobSourceResponse, status_code=status.HTTP_201_CREATED)
def register_job_source(body: CreateJobSourceBody, service: JobSourceService = Depends(get_service)):
    existing = service.find_by_name(body.sourceName)
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "A job source with this name already exists.")

    created = service.register_source(
        source_name=body.sourceName,
        source_url=body.sourceUrl,
        enabled_for_scrapping=body.enabledForScrapping,
        scrape_type_id=body.scrapeTypeId,
        scraping_schedule_id=body.scrapingScheduleId,
        api_endpoint=body.apiEndpoint,
        api_key=body.apiKey,
        company_name=body.companyName,
    )
    return JobSourceResponse.from_entity(created)
