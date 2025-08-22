from core.service.UserService import UserService
from core.models.User import User
from typing import List, Optional

class UserServiceImpl(UserService):
    def __init__(self):
        self.users = []  # In-memory storage for users (replace with database in production)

    def create_user(self, user: User) -> User:
        """Create a new user"""
        self.users.append(user)
        return user

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Retrieve a user by their ID"""
        for user in self.users:
            if user.id == user_id:
                return user
        return None

    def update_user(self, user: User) -> Optional[User]:
        """Update an existing user"""
        for i, existing_user in enumerate(self.users):
            if existing_user.id == user.id:
                self.users[i] = user
                return user
        return None

    def delete_user(self, user_id: str) -> bool:
        """Delete a user by their ID"""
        for i, user in enumerate(self.users):
            if user.id == user_id:
                self.users.pop(i)
                return True
        return False

    def get_all_users(self) -> List[User]:
        """Retrieve all users"""
        return self.users

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user by their email"""
        for user in self.users:
            if user.email == email:
                return user
        return None
    

    