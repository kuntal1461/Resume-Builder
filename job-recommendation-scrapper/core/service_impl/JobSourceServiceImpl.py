from typing import Optional

from core.entity.CompanyMasterEntity import CompanyMasterEntity
from core.entity.JobSourceEntity import JobSourceEntity
from core.enums.job_source_name import JobSourceName
from core.repository.company_master_repository import CompanyMasterRepository
from core.repository.job_source_repository import JobSourceRepository
from core.service.JobSourceService import JobSourceService
from core.util import generate_unique_company_slug, slugify_company_name


class JobSourceServiceImpl(JobSourceService):
    """Repository-backed implementation for job source orchestration."""

    def __init__(
        self,
        job_source_repository: JobSourceRepository,
        company_repository: CompanyMasterRepository,
    ):
        self._repo = job_source_repository
        self._company_repo = company_repository

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
        company_id: Optional[int] = None
        if company_name:
            existing_company = self._company_repo.find_by_name(company_name)
            if existing_company is None:
                normalized_name = company_name.strip()
                base_slug = slugify_company_name(normalized_name)
                slug = generate_unique_company_slug(base_slug, self._company_repo)
                new_company = CompanyMasterEntity(company_name=normalized_name, slug=slug)
                created_company = self._company_repo.create(new_company)
                company_id = created_company.id
            else:
                company_id = existing_company.id

        entity = JobSourceEntity(
            source_name=int(source_name),
            source_url=source_url,
            enabled_for_scrapping=enabled_for_scrapping,
            scrape_type=scrape_type_id,
            api_endpoint=api_endpoint,
            api_key=api_key,
            scraping_schedule=scraping_schedule_id,
            company_id=company_id,
        )
        return self._repo.create(entity)
