"""SQLAlchemy model for the job_raw_scrape table."""

from sqlalchemy import BigInteger, Column, ForeignKey, Text

from core.baseEntity.baseEntity import BaseEntity
from core.constants.table_constant import TableConstant


class JobRawScrapeEntity(BaseEntity):
    __tablename__ = TableConstant.JOB_RAW_SCRAPE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    source_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.JOB_SOURCE}.id"),
        nullable=False,
        index=True,
    )
    job_url = Column(Text, nullable=False)
    raw_content = Column(Text, nullable=True)
    status = Column(BigInteger, nullable=True)
    error_message = Column(Text, nullable=True)
