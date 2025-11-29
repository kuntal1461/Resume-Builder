"""REST endpoints for interacting with job sources."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName
from core.repository.job_source_repository import JobSourceRepository
from ..database import get_db

router = APIRouter(prefix="/api/job-sources", tags=["job-sources"])


class JobSourceResponse(BaseModel):
    id: int
    sourceNameId: int = Field(..., ge=1)
    sourceName: str
    sourceUrl: Optional[str]
    enabledForScrapping: bool

    @classmethod
    def from_entity(cls, entity: JobSourceEntity) -> "JobSourceResponse":
        label = str(entity.source_name)
        try:
            enum_value = JobSourceName(entity.source_name)
            label = enum_value.label
        except ValueError:
            enum_value = None

        return cls(
            id=entity.id,
            sourceNameId=entity.source_name,
            sourceName=label if label else str(entity.source_name),
            sourceUrl=entity.source_url,
            enabledForScrapping=entity.enabled_for_scrapping,
        )


class CreateJobSourceBody(BaseModel):
    sourceName: JobSourceName
    sourceUrl: Optional[str] = Field(default=None, max_length=2000)
    enabledForScrapping: bool = True


def get_repository(db: Session = Depends(get_db)) -> JobSourceRepository:
    return JobSourceRepository(db)


@router.get("", response_model=List[JobSourceResponse])
def list_job_sources(
    includeDisabled: bool = Query(default=False),
    repo: JobSourceRepository = Depends(get_repository),
):
    sources = repo.list_sources(only_enabled=not includeDisabled)
    return [JobSourceResponse.from_entity(source) for source in sources]


@router.get("/{source_id}", response_model=JobSourceResponse)
def fetch_job_source(source_id: int, repo: JobSourceRepository = Depends(get_repository)):
    entity = repo.find_by_id(source_id)
    if not entity:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Job source not found.")
    return JobSourceResponse.from_entity(entity)


@router.post("", response_model=JobSourceResponse, status_code=status.HTTP_201_CREATED)
def register_job_source(body: CreateJobSourceBody, repo: JobSourceRepository = Depends(get_repository)):
    existing = repo.find_by_name(body.sourceName)
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "A job source with this name already exists.")

    entity = JobSourceEntity(
        source_name=int(body.sourceName),
        source_url=body.sourceUrl,
        enabled_for_scrapping=body.enabledForScrapping,
    )
    created = repo.create(entity)
    return JobSourceResponse.from_entity(created)

