from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from core.repository import AdminUserRepository
from core.service import AdminProfile, AdminProfileService
from core.serviceImpl import AdminProfileServiceImpl

from ..database import get_db

router = APIRouter(prefix="/admins", tags=["admins"])


class AdminProfileResponse(BaseModel):
    id: int
    email: EmailStr
    username: str | None = None
    firstName: str | None = None
    lastName: str | None = None
    isAdmin: bool = True


def _get_admin_profile_service(db: Session = Depends(get_db)) -> AdminProfileService:
    user_repo = AdminUserRepository(db)
    return AdminProfileServiceImpl(session=db, user_repo=user_repo)


def _serialize_profile(profile: AdminProfile) -> AdminProfileResponse:
    return AdminProfileResponse(
        id=int(profile.id),
        email=profile.email,
        username=profile.username,
        firstName=profile.first_name,
        lastName=profile.last_name,
        isAdmin=bool(profile.is_admin),
    )


@router.get("/current", response_model=AdminProfileResponse)
def get_current_admin_profile(
    service: AdminProfileService = Depends(_get_admin_profile_service),
):
    profile = service.get_or_create_current_admin()
    return _serialize_profile(profile)
