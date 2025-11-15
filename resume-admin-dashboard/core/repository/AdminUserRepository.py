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
