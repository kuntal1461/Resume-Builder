

class UserService:
    def authenticate_user_email(self, email: str, password: str) -> Optional[UserEntity]:
        raise NotImplementedError