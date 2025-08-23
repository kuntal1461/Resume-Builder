from core.entity.UserEntity import UserEntity
from sqlalchemy.orm import Session

class UserRepository:

    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_user(self, user: UserEntity):
        self.db_session.add(user)
        self.db_session.commit()
        self.db_session.refresh(user)
        return user

    def get_user(self, user_id: int) -> UserEntity:
        return self.db_session.query(UserEntity).filter(UserEntity.id == user_id).first()

    def get_user_by_email(self, email: str) -> UserEntity:
        return self.db_session.query(UserEntity).filter(UserEntity.email == email).first()

    def update_user(self, user: UserEntity):
        self.db_session.merge(user)
        self.db_session.commit()
        return user

    def delete_user(self, user_id: int):
        user = self.get_user(user_id)
        if user:
            self.db_session.delete(user)
            self.db_session.commit()

        return user
    
    def get_all_users(self):
        return self.db_session.query(UserEntity).all()
    
    def get_user_by_username(self, username: str) -> UserEntity:
        return self.db_session.query(UserEntity).filter(UserEntity.username == username).first()        
    

    def get_user_by_email(self, email: str) -> UserEntity:
        return self.db_session.query(UserEntity).filter(UserEntity.email == email).first()
    
    def get_active_users(self):
        return self.db_session.query(UserEntity).filter(UserEntity.is_active == True).all()
    
    def deactivate_user(self, user_id: int):
        user = self.get_user(user_id)
        if user:
            user.is_active = False
            self.db_session.commit()
        return user
    
