from core.entity.UserEntity import UserEntity
from core.exceptions.auth import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UserNotFoundError,
)
from core.repository.userRepo import UserRepository
from core.requestVO.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.requestVO.AuthRegisterRequestVO import AuthRegisterRequestVO
from core.responseVO.AuthEmailLoginResponseVO import AuthEmailLoginResponseVO
from core.responseVO.AuthRegisterResponseVO import AuthRegisterResponseVO
from core.service.UserService import UserService
from core.util import hash_password, verify_password


class UserServiceImpl(UserService):
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def authenticate_user_email(self, req: AuthEmailLoginRequestVO) -> AuthEmailLoginResponseVO:
        """
        1) Fetch user by email (repo)
        2) If not found -> raise UserNotFoundError
        3) Verify plaintext password against password_hash (bcrypt)
        4) If mismatch -> raise InvalidCredentialsError
        5) If match -> return Response VO
        """
        user = self.user_repository.get_user_by_email(req.email)

        if not user:
            raise UserNotFoundError("No account found for the provided email.")

        if not verify_password(req.password, user.password_hash):
            raise InvalidCredentialsError("Invalid email or password.")

        return AuthEmailLoginResponseVO(
            success=True,
            message="Login successful",
            user_id=user.id,
            email=user.email,
            username=getattr(user, "username", None),
        )

    def register_user(self, req: AuthRegisterRequestVO) -> AuthRegisterResponseVO:
        if self.user_repository.get_user_by_email(req.email):
            raise UserAlreadyExistsError("Email already registered.")

        if self.user_repository.get_user_by_username(req.username):
            raise UserAlreadyExistsError("Username already taken.")

        if req.phone_number and self.user_repository.get_user_by_phone(req.phone_number):
            raise UserAlreadyExistsError("Phone number already registered.")

        user = UserEntity(
            username=req.username,
            email=req.email,
            password_hash=hash_password(req.password),
            first_name=req.first_name,
            last_name=req.last_name,
            phone_number=req.phone_number,
            is_active=True,
            signInBy="email",
        )

        created_user = self.user_repository.create_user(user)

        return AuthRegisterResponseVO(
            success=True,
            message="Registration successful",
            user_id=created_user.id,
            email=created_user.email,
            username=created_user.username,
            phone_number=created_user.phone_number,
        )
