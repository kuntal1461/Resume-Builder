from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Iterable, Sequence

from ..util.scrapper_api_integration import JobSourceRecord


@dataclass(frozen=True)
class JobSourceQueueEntryData:
    sourceNameId: int | None
    sourceType: str | None
    url: str
    enabledForScrapping: bool
    company: str | None
    scrapeTypeId: int | None
    scrapeType: str | None
    cadenceId: int | None
    cadence: str | None
    apiEndpoint: str | None
    apiKey: str | None


class JobSourceQueueError(ValueError):
    """Raised when the entries cannot be resolved."""


class JobSourceQueueService(ABC):
    """Contract for orchestrating job source submissions bound for the scraper."""

    @abstractmethod
    def queue_job_sources(
        self, entries: Sequence[JobSourceQueueEntryData] | Iterable[JobSourceQueueEntryData]
    ) -> list[JobSourceRecord]:
        """Forward the requested job sources to the scraper API."""
        raise NotImplementedError
