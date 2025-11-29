from abc import ABC, abstractmethod
from typing import List, Optional

from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName


class JobSourceService(ABC):
    """Contract describing job source orchestrations."""

    @abstractmethod
    def list_sources(self, *, only_enabled: bool = True) -> List[JobSourceEntity]:
        raise NotImplementedError

    @abstractmethod
    def fetch_by_id(self, source_id: int) -> Optional[JobSourceEntity]:
        raise NotImplementedError

    @abstractmethod
    def find_by_name(self, source_name: JobSourceName) -> Optional[JobSourceEntity]:
        raise NotImplementedError

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
