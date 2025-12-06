import os

from sqlalchemy.orm import Session

from ..repository import AdminUserRepository
from ..service.AdminProfileService import AdminProfile, AdminProfileService


DEFAULT_ADMIN_PROFILE = AdminProfile(
    id=0,
    email="admin@example.com",
    username="admin",
    first_name="Admin",
    last_name="User",
    is_admin=True,
)


def _build_fallback_profile() -> AdminProfile:
    """Build a fallback admin profile using environment overrides where available."""
    return AdminProfile(
        id=0,
        email=os.getenv("ADMIN_PROFILE_EMAIL", DEFAULT_ADMIN_PROFILE.email),
        username=os.getenv("ADMIN_PROFILE_USERNAME", DEFAULT_ADMIN_PROFILE.username),
        first_name=os.getenv("ADMIN_PROFILE_FIRST_NAME", DEFAULT_ADMIN_PROFILE.first_name),
        last_name=os.getenv("ADMIN_PROFILE_LAST_NAME", DEFAULT_ADMIN_PROFILE.last_name),
        is_admin=True,
    )


class AdminProfileServiceImpl(AdminProfileService):
    """Default implementation backed by the shared users table."""

    def __init__(self, *, session: Session, user_repo: AdminUserRepository) -> None:
        self._session = session
        self._user_repo = user_repo

    def get_or_create_current_admin(self) -> AdminProfile:
        admin = self._user_repo.find_first_admin()
        if admin is None:
            fallback = _build_fallback_profile()
            admin = self._user_repo.create_admin(
                email=fallback.email,
                username=fallback.username or DEFAULT_ADMIN_PROFILE.username,
                first_name=fallback.first_name,
                last_name=fallback.last_name,
                is_admin=True,
            )

        return AdminProfile(
            id=int(admin.id),
            email=admin.email,
            username=admin.username,
            first_name=getattr(admin, "first_name", None),
            last_name=getattr(admin, "last_name", None),
            is_admin=bool(getattr(admin, "is_admin", True)),
        )

