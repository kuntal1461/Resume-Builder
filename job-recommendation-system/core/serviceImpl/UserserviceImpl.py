from core.service.UserService import UserService
from core.repository.userRepo import UserRepository
from core.util import verify_password
from core.exceptions.auth import UserNotFoundError, InvalidCredentialsError
from core.requestVO.AuthEmailLoginRequestVO import AuthEmailLoginRequestVO
from core.responseVO.AuthEmailLoginResponseVO import AuthEmailLoginResponseVO


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