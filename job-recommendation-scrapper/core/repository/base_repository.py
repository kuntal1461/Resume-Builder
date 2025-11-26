from typing import List

from sqlalchemy.orm import Session

from core.entity.models import JobListingEntity


class JobListingRepository:
    def __init__(self, db_session: Session):
        self.db = db_session

    def create(self, listing: JobListingEntity) -> JobListingEntity:
        self.db.add(listing)
        self.db.commit()
        self.db.refresh(listing)
        return listing

    def get_all(self, limit: int = 100, offset: int = 0) -> List[JobListingEntity]:
        return self.db.query(JobListingEntity).offset(offset).limit(limit).all()
