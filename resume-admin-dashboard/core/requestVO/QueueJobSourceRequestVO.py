from dataclasses import dataclass
from typing import Optional

from ..enums import JobSourceName, ScrapeType, ScrapingSchedule


@dataclass(frozen=True)
class QueueJobSourceRequestVO:
    """Value object describing a job source submission coming from the UI."""

    company_name: Optional[str]
    source_name: JobSourceName
    source_url: str
    scrape_type: ScrapeType
    scraping_schedule: ScrapingSchedule
    api_endpoint: Optional[str] = None
    api_key: Optional[str] = None
    enabled_for_scrapping: bool = True
