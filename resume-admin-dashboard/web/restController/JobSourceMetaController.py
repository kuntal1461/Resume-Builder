"""REST endpoints that expose job source metadata for the admin UI."""

from fastapi import APIRouter

from core.enums import JobSourceName, ScrapeType, ScrapingSchedule

router = APIRouter(prefix="/job-sources", tags=["Job sources"])


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
