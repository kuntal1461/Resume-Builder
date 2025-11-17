from typing import Optional

from sqlalchemy.orm import Session

from core.entity.UserResumeVersionEntity import UserResumeVersionEntity


class UserResumeVersionRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, entity: UserResumeVersionEntity) -> UserResumeVersionEntity:
        self.db_session.add(entity)
        self.db_session.commit()
        self.db_session.refresh(entity)
        return entity

    def get_latest_for_resume(self, user_resume_id: int) -> Optional[UserResumeVersionEntity]:
        return (
            self.db_session.query(UserResumeVersionEntity)
            .filter(UserResumeVersionEntity.user_resume_id == user_resume_id)
            .order_by(UserResumeVersionEntity.id.desc())
            .first()
        )
