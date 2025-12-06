from abc import ABC, abstractmethod
from typing import Optional

from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName


class JobSourceService(ABC):
    """Contract describing job source orchestrations.

    The service layer focuses on higher-level business workflows.
    Simple lookups remain on the repository layer.
    """

    @abstractmethod
    def register_source(
        self,
        *,
        source_name: JobSourceName,
        source_url: Optional[str],
        enabled_for_scrapping: bool,
        scrape_type_id: Optional[int],
        scraping_schedule_id: Optional[int],
        api_endpoint: Optional[str],
        api_key: Optional[str],
        company_name: Optional[str],
    ) -> JobSourceEntity:
        raise NotImplementedError
