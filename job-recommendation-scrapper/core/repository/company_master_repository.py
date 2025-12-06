"""Repository helpers for company_master rows."""

from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from core.entity.CompanyMasterEntity import CompanyMasterEntity


class CompanyMasterRepository:
    """Encapsulates basic read/write helpers for company_master."""

    def __init__(self, session: Session):
        self._session = session

    def find_by_id(self, company_id: int) -> Optional[CompanyMasterEntity]:
        return self._session.get(CompanyMasterEntity, company_id)

    def find_by_name(self, company_name: str) -> Optional[CompanyMasterEntity]:
        """Return a company by case-insensitive name match, if present."""
        normalized = company_name.strip()
        if not normalized:
            return None

        query = (
            self._session.query(CompanyMasterEntity)
            .filter(func.lower(CompanyMasterEntity.company_name) == normalized.lower())
        )
        return query.first()

    def find_by_slug(self, slug: str) -> Optional[CompanyMasterEntity]:
        """Return a company by exact slug, if present."""
        normalized = slug.strip()
        if not normalized:
            return None
        query = self._session.query(CompanyMasterEntity).filter(
            CompanyMasterEntity.slug == normalized
        )
        return query.first()

    def create(self, entity: CompanyMasterEntity) -> CompanyMasterEntity:
        """Persist a new company row."""
        self._session.add(entity)
        self._session.commit()
        self._session.refresh(entity)
        return entity
