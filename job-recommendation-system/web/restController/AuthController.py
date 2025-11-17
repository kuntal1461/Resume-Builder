from dataclasses import asdict
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, constr
from sqlalchemy.orm import Session

from core.service.UserService import UserService
from core.ServiceImpl.UserServiceImpl import UserServiceImpl
from core.repository.userRepo import UserRepository
from core.exceptions.auth import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UserNotFoundError,
)
from core.RequestVo.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.RequestVo.AuthRegisterRequestVO import AuthRegisterRequestVO
from ..database import get_db
from ..security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class EmailLoginBody(BaseModel):
    email: EmailStr
    password: str


class RegisterBody(BaseModel):
    username: constr(min_length=3, max_length=100)  # type: ignore[call-arg]
    email: EmailStr
    password: constr(min_length=6, max_length=128)  # type: ignore[call-arg]
    first_name: constr(min_length=1, max_length=100)  # type: ignore[call-arg]
    last_name: constr(min_length=1, max_length=100)  # type: ignore[call-arg]
    phone_number: Optional[constr(min_length=7, max_length=32)] = None  # type: ignore[call-arg]
    dob: Optional[datetime] = None
    is_admin: bool = False


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserServiceImpl(UserRepository(db))


class UserPayload(BaseModel):
    user_id: int
    email: Optional[str]
    username: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]
    is_admin: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPayload


@router.post("/login/email")
def login_email(body: EmailLoginBody, service: UserService = Depends(get_user_service)):
    return _issue_token_response(body.email, body.password, service)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(body: RegisterBody, service: UserService = Depends(get_user_service)):
    try:
        req = AuthRegisterRequestVO(
            username=body.username,
            email=body.email,
            password=body.password,
            first_name=body.first_name,
            last_name=body.last_name,
            phone_number=body.phone_number,
            dob=body.dob,
            is_admin=body.is_admin,
        )
        resp = service.register_user(req)
        return asdict(resp)
    except UserAlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc))


@router.post("/logout")
def logout_user(response: Response):
    """
    Placeholder logout endpoint.

    The frontend expects an `/auth/logout` route to exist so that it can revoke
    sessions (once implemented) and clear cookies on the client. Until server-side
    authentication issues cookies/tokens, we respond with success so the UI flow
    completes without throwing network errors.
    """
    # Clear common auth cookie names defensively (no-ops if they aren't set yet).
    response.delete_cookie("session")
    response.delete_cookie("refresh_token")
    response.delete_cookie("access_token")

    return {"success": True, "message": "Logged out"}


@router.get("/profile")
def get_user_profile(
    email: Optional[EmailStr] = Query(default=None),
    username: Optional[str] = Query(default=None, min_length=3, max_length=100),
    service: UserService = Depends(get_user_service),
):
    if not email and not username:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Provide an email or username to look up the profile.")

    try:
        profile = service.get_user_profile(email=email, username=username)
        return asdict(profile)
    except UserNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found.")


@router.post("/token", response_model=TokenResponse)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), service: UserService = Depends(get_user_service)
):
    return _issue_token_response(form_data.username, form_data.password, service)


def _issue_token_response(username: str, password: str, service: UserService) -> dict:
    try:
        req = AuthEmailLoginRequestVO(email=username, password=password)
        resp = service.authenticate_user_email(req)
    except UserNotFoundError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Email not registered")
    except InvalidCredentialsError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    token = create_access_token(subject=str(resp.user_id))
    payload = UserPayload(
        user_id=resp.user_id,
        email=resp.email,
        username=resp.username,
        first_name=resp.first_name,
        last_name=resp.last_name,
        is_admin=resp.is_admin,
    )
    response = TokenResponse(access_token=token, token_type="bearer", user=payload)
    return response.model_dump()
