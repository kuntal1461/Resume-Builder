from typing import List, Optional

from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName
from core.repository.job_source_repository import JobSourceRepository
from core.service.JobSourceService import JobSourceService


class JobSourceServiceImpl(JobSourceService):
    """Repository-backed implementation for job source orchestration."""

    def __init__(self, repository: JobSourceRepository):
        self._repo = repository

    def list_sources(self, *, only_enabled: bool = True) -> List[JobSourceEntity]:
        return self._repo.list_sources(only_enabled=only_enabled)

    def fetch_by_id(self, source_id: int) -> Optional[JobSourceEntity]:
        return self._repo.find_by_id(source_id)

    def find_by_name(self, source_name: JobSourceName) -> Optional[JobSourceEntity]:
        return self._repo.find_by_name(source_name)

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
        entity = JobSourceEntity(
            source_name=int(source_name),
            source_url=source_url,
            enabled_for_scrapping=enabled_for_scrapping,
            scrape_type=scrape_type_id,
            api_endpoint=api_endpoint,
            api_key=api_key,
            scraping_schedule=scraping_schedule_id,
        )
        if company_name:
            entity.field1 = company_name
        return self._repo.create(entity)
