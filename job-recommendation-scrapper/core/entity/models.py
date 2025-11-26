from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, JSON, String, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class JobListingEntity(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    salary = Column(String(255), nullable=True)
    job_type = Column(String(100), nullable=True)
    experience_level = Column(String(100), nullable=True)
    skills = Column(JSON, nullable=True)
    posted_date = Column(DateTime, nullable=True)
    application_url = Column(Text, nullable=True)
    source_url = Column(Text, nullable=False)
    scraped_at = Column(DateTime, default=datetime.utcnow)
    raw_data = Column(JSON, nullable=True)
