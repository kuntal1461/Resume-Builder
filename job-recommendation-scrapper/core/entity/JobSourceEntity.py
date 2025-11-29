"""SQLAlchemy model for job_source table."""

from sqlalchemy import BigInteger, Boolean, Column, String, Text

from core.baseEntity.baseEntity import BaseEntity
from core.constants.table_constant import TableConstant


class JobSourceEntity(BaseEntity):
    __tablename__ = TableConstant.JOB_SOURCE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    source_name = Column(String(255), nullable=False)
    source_url = Column(Text, nullable=True)
    enabled_for_scrapping = Column(Boolean, nullable=False, default=True)
    scrape_type = Column(BigInteger, nullable=True)
    api_endpoint = Column(String(500), nullable=True)
    api_key = Column(String(500), nullable=True)
    rate_limit_per_min = Column(String(50), nullable=True)
    scraping_schedule = Column(BigInteger, nullable=True)
