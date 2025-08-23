from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from core.service.UserService import UserService
from core.serviceImpl import UserServiceImpl
from core.repository import UserRepository
from core.exceptions.auth import UserNotFoundError, InvalidCredentialsError
from core.requestVO.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.requestVO import AuthPhoneLoginRequestVO
from database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

class EmailLoginBody(BaseModel):
    email: EmailStr
    password: str

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserServiceImpl(UserRepository(db))

@router.post("/login/email")
def login_email(body: EmailLoginBody, service: UserService = Depends(get_user_service)):
    try:
        req = AuthEmailLoginRequestVO(email=body.email, password=body.password)
        resp = service.authenticate_user_email(req)
        return resp.__dict__
    except UserNotFoundError:
        raise HTTPException(404, "Email not registered")
    except InvalidCredentialsError:
        raise HTTPException(401, "Invalid email or password")
