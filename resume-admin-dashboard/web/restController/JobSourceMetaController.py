"""REST endpoints that expose job source metadata and queue APIs for the admin UI."""

from dataclasses import asdict
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator

from core.enums import JobSourceName, ScrapeType, ScrapingSchedule
from core.requestVO import QueueJobSourceRequestVO
from core.service import JobSourceQueueEntryData, JobSourceQueueError, JobSourceQueueService
from core.serviceImpl import JobSourceQueueServiceImpl
from core.util.scrapper_api_integration import ScrapperApiError

router = APIRouter(prefix="/job-sources", tags=["Job sources"])


def _get_job_source_queue_service() -> JobSourceQueueService:
    return JobSourceQueueServiceImpl()


def _serialize_enum(enum_cls):
    return [
        {
            "code": enum_member.value,
            "label": enum_member.label,
        }
        for enum_member in enum_cls
    ]


@router.get("/meta")
async def job_source_metadata():
    """Return dropdown values for job sources and scraper settings."""

    return {
        "sources": _serialize_enum(JobSourceName),
        "scrapeTypes": _serialize_enum(ScrapeType),
        "scrapeCadences": _serialize_enum(ScrapingSchedule),
    }


class JobSourceQueueEntry(BaseModel):
    sourceNameId: int | None = Field(default=None, ge=1)
    sourceType: str | None = None
    url: HttpUrl
    enabledForScrapping: bool = True
    company: str | None = Field(default=None, max_length=255)
    scrapeTypeId: int | None = Field(default=None, ge=1)
    scrapeType: str | None = None
    cadenceId: int | None = Field(default=None, ge=1)
    cadence: str | None = None
    apiEndpoint: HttpUrl | None = None
    apiKey: str | None = Field(default=None, max_length=2048)

    model_config = ConfigDict(extra="forbid")

    @field_validator("sourceType", "company", "scrapeType", "cadence", "apiKey")
    @classmethod
    def _strip_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None


class JobSourceQueuePayload(BaseModel):
    entries: List[JobSourceQueueEntry] = Field(..., min_length=1)

    model_config = ConfigDict(extra="forbid")


@router.post(
    "/queue",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Queue job sources for scraping",
)
def queue_job_sources(
    payload: JobSourceQueuePayload,
    service: JobSourceQueueService = Depends(_get_job_source_queue_service),
):
    """Accept job source submissions and forward them to the scraper API."""

    entries = [
        JobSourceQueueEntryData(
            sourceNameId=entry.sourceNameId,
            sourceType=entry.sourceType,
            url=str(entry.url),
            enabledForScrapping=entry.enabledForScrapping,
            company=entry.company,
            scrapeTypeId=entry.scrapeTypeId,
            scrapeType=entry.scrapeType,
            cadenceId=entry.cadenceId,
            cadence=entry.cadence,
            apiEndpoint=str(entry.apiEndpoint) if entry.apiEndpoint else None,
            apiKey=entry.apiKey,
        )
        for entry in payload.entries
    ]

    try:
        scrapper_records = service.queue_job_sources(entries)
    except JobSourceQueueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except ScrapperApiError as exc:
        raise HTTPException(
            status_code=exc.status_code or status.HTTP_502_BAD_GATEWAY,
            detail=exc.response_text or str(exc),
        ) from exc
    except Exception as exc:  # pragma: no cover - defensive block
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY, "Failed to queue job sources."
        ) from exc

    return {
        "success": True,
        "queuedCount": len(scrapper_records),
        "scrapperSources": [asdict(record) for record in scrapper_records],
    }
