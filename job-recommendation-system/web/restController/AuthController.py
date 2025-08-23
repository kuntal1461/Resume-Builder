from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.service. import UserServiceImpl
from core.repository.UserRepository import UserRepository
from core.exceptions.auth import UserNotFoundError, InvalidCredentialsError
from database import get_db   # <-- your DB session dependency

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    service = UserServiceImpl(UserRepository(db))
    try:
        user = service.authenticate_user_email(email, password)
        return {"message": "Login successful", "userId": user.id, "email": user.email}
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="Email not registered")
    except InvalidCredentialsError:
        raise HTTPException(status_code=401, detail="Invalid email or password")