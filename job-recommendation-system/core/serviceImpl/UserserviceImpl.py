from core.service.UserService import UserService
from core.entity.UserEntity import UserEntity
from typing import List, Optional
from core.exceptions import UserNotFoundError, InvalidCredentialsError
from core.util.passwords import hash_password, verify_password
# Implementation of UserService
class UserServiceImpl(UserService):
    def __init__(self):
        self.users = list[UserEntity]()  # In-memory storage for users (replace with database in production)

    def authenticate_user_email(self, email: str, password: str) -> UserEntity:
        """
        1) Fetch user by email (repo).
        2) If not found -> raise UserNotFoundError.
        3) If found -> verify plaintext password against password_hash (bcrypt).
        4) If mismatch -> raise InvalidCredentialsError.
        5) If match -> return UserEntity.
        """
        user: Optional[UserEntity] = self.user_repository.get_user_by_email(email)

        if user is None:
            # Email not present in DB
            raise UserNotFoundError("No account found for the provided email.")

        # user.password_hash is the hashed value stored in DB
        if not verify_password(password, user.password_hash):
            # Email exists but password wrong
            raise InvalidCredentialsError("Invalid email or password.")

        # Auth successful
        return user