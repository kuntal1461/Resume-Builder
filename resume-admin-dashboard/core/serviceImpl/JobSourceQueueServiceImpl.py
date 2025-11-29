from typing import Iterable, Sequence

from ..requestVO import QueueJobSourceRequestVO
from ..service.JobSourceQueueService import (
    JobSourceQueueEntryData,
    JobSourceQueueError,
    JobSourceQueueService,
)
from ..util.scrapper_api_integration import JobSourceRecord, ScrapperApiClient
from ..enums import JobSourceName, ScrapeType, ScrapingSchedule


def _normalize_label(value: str | None) -> str | None:
    if value is None:
        return None
    normalized = value.strip()
    return normalized or None


def _resolve_source_enum(entry: JobSourceQueueEntryData, *, index: int) -> JobSourceName:
    if entry.sourceNameId is not None:
        try:
            return JobSourceName(entry.sourceNameId)
        except ValueError as exc:
            raise JobSourceQueueError(
                f"Row {index + 1}: invalid sourceNameId '{entry.sourceNameId}'."
            ) from exc

    normalized = _normalize_label(entry.sourceType)
    if normalized:
        for option in JobSourceName:
            if option.label.lower() == normalized.lower():
                return option

    raise JobSourceQueueError(f"Row {index + 1}: specify a valid sourceNameId or sourceType.")


def _resolve_scrape_type(entry: JobSourceQueueEntryData, *, index: int) -> ScrapeType:
    if entry.scrapeTypeId is not None:
        try:
            return ScrapeType(entry.scrapeTypeId)
        except ValueError as exc:
            raise JobSourceQueueError(
                f"Row {index + 1}: invalid scrapeTypeId '{entry.scrapeTypeId}'."
            ) from exc

    normalized = _normalize_label(entry.scrapeType)
    if normalized:
        for option in ScrapeType:
            if option.label.lower() == normalized.lower():
                return option

    raise JobSourceQueueError(f"Row {index + 1}: specify a valid scrapeTypeId or scrapeType.")


def _resolve_scraping_schedule(
    entry: JobSourceQueueEntryData, *, index: int
) -> ScrapingSchedule:
    if entry.cadenceId is not None:
        try:
            return ScrapingSchedule(entry.cadenceId)
        except ValueError as exc:
            raise JobSourceQueueError(
                f"Row {index + 1}: invalid cadenceId '{entry.cadenceId}'."
            ) from exc

    normalized = _normalize_label(entry.cadence)
    if normalized:
        for option in ScrapingSchedule:
            if option.label.lower() == normalized.lower():
                return option

    raise JobSourceQueueError(f"Row {index + 1}: specify a valid cadenceId or cadence.")


def _build_queue_requests(
    entries: Sequence[JobSourceQueueEntryData],
) -> list[QueueJobSourceRequestVO]:
    requests: list[QueueJobSourceRequestVO] = []
    for index, entry in enumerate(entries):
        source_enum = _resolve_source_enum(entry, index=index)
        scrape_type = _resolve_scrape_type(entry, index=index)
        schedule = _resolve_scraping_schedule(entry, index=index)

        if scrape_type is ScrapeType.API:
            if not entry.apiEndpoint:
                raise JobSourceQueueError(
                    f"Row {index + 1}: apiEndpoint is required for API scrape type."
                )
            if not entry.apiKey:
                raise JobSourceQueueError(
                    f"Row {index + 1}: apiKey is required for API scrape type."
                )

        requests.append(
            QueueJobSourceRequestVO(
                company_name=entry.company,
                source_name=source_enum,
                source_url=entry.url,
                scrape_type=scrape_type,
                scraping_schedule=schedule,
                api_endpoint=entry.apiEndpoint,
                api_key=entry.apiKey,
                enabled_for_scrapping=entry.enabledForScrapping,
            )
        )
    return requests


class JobSourceQueueServiceImpl(JobSourceQueueService):
    """Default implementation that proxies job sources to the scraper FastAPI service."""

    def __init__(self, *, scrapper_client: ScrapperApiClient | None = None) -> None:
        self._client = scrapper_client or ScrapperApiClient()

    def queue_job_sources(
        self, entries: Sequence[JobSourceQueueEntryData] | Iterable[JobSourceQueueEntryData]
    ) -> list[JobSourceRecord]:
        created_records: list[JobSourceRecord] = []
        requests = _build_queue_requests(list(entries))
        for request in requests:
            record = self._client.create_job_source(
                source_name=int(request.source_name),
                source_url=request.source_url,
                enabled_for_scrapping=request.enabled_for_scrapping,
                scrape_type_id=int(request.scrape_type),
                scraping_schedule_id=int(request.scraping_schedule),
                api_endpoint=request.api_endpoint,
                api_key=request.api_key,
                company_name=request.company_name,
            )
            created_records.append(record)
        return created_records
