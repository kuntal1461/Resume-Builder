import os

from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from core.repository import AdminUserRepository

from ..database import get_db

router = APIRouter(prefix="/admins", tags=["admins"])


class AdminProfileResponse(BaseModel):
    id: int
    email: EmailStr
    username: str | None = None
    firstName: str | None = None
    lastName: str | None = None
    isAdmin: bool = True


def _fallback_profile() -> AdminProfileResponse:
    fallback_email = os.getenv("ADMIN_PROFILE_EMAIL", "admin@example.com")
    fallback_username = os.getenv("ADMIN_PROFILE_USERNAME", "admin")
    return AdminProfileResponse(
        id=0,
        email=fallback_email,
        username=fallback_username,
        firstName=os.getenv("ADMIN_PROFILE_FIRST_NAME", "Admin"),
        lastName=os.getenv("ADMIN_PROFILE_LAST_NAME", "User"),
        isAdmin=True,
    )


@router.get("/current", response_model=AdminProfileResponse)
def get_current_admin_profile(
    db: Session = Depends(get_db),
):
    repository = AdminUserRepository(db)
    admin = repository.find_first_admin()
    if admin is None:
        admin_email = os.getenv("ADMIN_PROFILE_EMAIL", "admin@example.com")
        admin_username = os.getenv("ADMIN_PROFILE_USERNAME", "admin")
        admin_first_name = os.getenv("ADMIN_PROFILE_FIRST_NAME", "Admin")
        admin_last_name = os.getenv("ADMIN_PROFILE_LAST_NAME", "User")
        admin = repository.create_admin(
            email=admin_email,
            username=admin_username,
            first_name=admin_first_name,
            last_name=admin_last_name,
            is_admin=True,
        )

    return AdminProfileResponse(
        id=int(admin.id),
        email=admin.email,
        username=admin.username,
        firstName=getattr(admin, "first_name", None),
        lastName=getattr(admin, "last_name", None),
        isAdmin=bool(getattr(admin, "is_admin", True)),
    )
