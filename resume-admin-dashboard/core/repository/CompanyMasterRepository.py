from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from core.entity.CompanyMasterEntity import CompanyMasterEntity


class CompanyMasterRepository:
    """Persistence helpers for company_master rows."""

    def __init__(self, session: Session):
        self._session = session

    def _base_query(self):
        return select(CompanyMasterEntity)

    def list_companies(
        self,
        *,
        include_inactive: bool = False,
    ) -> List[CompanyMasterEntity]:
        stmt = self._base_query()
        if not include_inactive:
            stmt = stmt.where(CompanyMasterEntity.rowstate == 1)
        stmt = stmt.order_by(CompanyMasterEntity.company_name.asc())
        result = self._session.execute(stmt)
        return list(result.scalars().all())

    def find_by_id(self, company_id: int) -> Optional[CompanyMasterEntity]:
        return self._session.get(CompanyMasterEntity, company_id)

    def find_by_slug(self, slug: str) -> Optional[CompanyMasterEntity]:
        stmt = self._base_query().where(CompanyMasterEntity.slug == slug)
        result = self._session.execute(stmt)
        return result.scalars().first()

    def find_by_name(self, company_name: str) -> Optional[CompanyMasterEntity]:
        normalized_name = (company_name or "").strip().lower()
        if not normalized_name:
            return None

        stmt = self._base_query().where(
            func.lower(CompanyMasterEntity.company_name) == normalized_name
        )
        result = self._session.execute(stmt)
        return result.scalars().first()

    def create_company(
        self,
        *,
        company_name: str,
        slug: str,
        logged_by: int,
        domain: Optional[str] = None,
        logo_url: Optional[str] = None,
        website_url: Optional[str] = None,
    ) -> CompanyMasterEntity:
        entity = CompanyMasterEntity(
            company_name=company_name.strip(),
            slug=slug,
            domain=domain,
            logo_url=logo_url,
            website_url=website_url,
        )
        entity.loggedBy = logged_by
        entity.lastUpdatedBy = logged_by
        self._session.add(entity)
        self._session.flush()
        return entity
