from typing import Dict, Iterable, Optional, Set

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..entity.AdminUserEntity import AdminUserEntity


class AdminUserRepository:
    """Data-access helpers for the shared users table."""

    def __init__(self, session: Session):
        self._session = session

    def find_by_email(self, email: str) -> Optional[AdminUserEntity]:
        stmt = select(AdminUserEntity).where(AdminUserEntity.email == email)
        result = self._session.execute(stmt)
        return result.scalars().first()

    def find_first_admin(self) -> Optional[AdminUserEntity]:
        stmt = (
            select(AdminUserEntity)
            .where(AdminUserEntity.is_admin.is_(True))
            .order_by(AdminUserEntity.id.asc())
        )
        result = self._session.execute(stmt)
        return result.scalars().first()

    def create_admin(
        self,
        *,
        email: str,
        username: str,
        first_name: str | None = None,
        last_name: str | None = None,
        is_admin: bool = True,
    ) -> AdminUserEntity:
        entity = AdminUserEntity(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            is_admin=is_admin,
            is_active=True,
        )
        self._session.add(entity)
        self._session.commit()
        self._session.refresh(entity)
        return entity

    def fetch_by_ids(
        self, user_ids: Iterable[int]
    ) -> Dict[int, AdminUserEntity]:
        normalized_ids: Set[int] = {
            int(user_id) for user_id in user_ids if user_id is not None
        }
        if not normalized_ids:
            return {}

        stmt = select(AdminUserEntity).where(
            AdminUserEntity.id.in_(normalized_ids)
        )
        result = self._session.execute(stmt)
        return {int(user.id): user for user in result.scalars().all()}
