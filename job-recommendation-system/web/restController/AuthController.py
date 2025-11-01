from dataclasses import asdict
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, constr
from sqlalchemy.orm import Session

from core.service.UserService import UserService
from core.serviceImpl.UserServiceImpl import UserServiceImpl
from core.repository.userRepo import UserRepository
from core.exceptions.auth import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UserNotFoundError,
)
from core.requestVO.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.requestVO.AuthRegisterRequestVO import AuthRegisterRequestVO
from ..database import get_db

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


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserServiceImpl(UserRepository(db))


@router.post("/login/email")
def login_email(body: EmailLoginBody, service: UserService = Depends(get_user_service)):
    try:
        req = AuthEmailLoginRequestVO(email=body.email, password=body.password)
        resp = service.authenticate_user_email(req)
        return asdict(resp)
    except UserNotFoundError:
        raise HTTPException(404, "Email not registered")
    except InvalidCredentialsError:
        raise HTTPException(401, "Invalid email or password")


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
        )
        resp = service.register_user(req)
        return asdict(resp)
    except UserAlreadyExistsError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc))
