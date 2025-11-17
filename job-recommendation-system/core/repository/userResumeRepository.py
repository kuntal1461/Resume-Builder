from typing import Optional

from sqlalchemy.orm import Session

from core.entity.UserResumeEntity import UserResumeEntity


class UserResumeRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_by_user_and_template(self, user_id: int, template_id: int) -> Optional[UserResumeEntity]:
        return (
            self.db_session.query(UserResumeEntity)
            .filter(
                UserResumeEntity.user_id == user_id,
                UserResumeEntity.template_id == template_id,
            )
            .order_by(UserResumeEntity.id.desc())
            .first()
        )

    def save(self, entity: UserResumeEntity) -> UserResumeEntity:
        self.db_session.add(entity)
        self.db_session.commit()
        self.db_session.refresh(entity)
        return entity
