from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/current", response_model=AdminProfileResponse)
def get_current_admin_profile(
    db: Session = Depends(get_db),
):
    repository = AdminUserRepository(db)
    admin = repository.find_first_admin()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin profile not found.")

    return AdminProfileResponse(
        id=int(admin.id),
        email=admin.email,
        username=admin.username,
        firstName=getattr(admin, "first_name", None),
        lastName=getattr(admin, "last_name", None),
        isAdmin=bool(getattr(admin, "is_admin", True)),
    )
