from sqlalchemy import BigInteger, Column, ForeignKey, Text

from core.baseEntity.baseEntity import Base, CommonEntity
from core.constants import TableConstant
from core.enums import JobRawScrapeStatus


class JobRawScrapeEntity(Base, CommonEntity):
    """ORM mapping for job_raw_scrape table."""

    __tablename__ = TableConstant.JOB_RAW_SCRAPE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    source_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.JOB_SOURCE}.id"),
        nullable=False,
    )
    job_url = Column(Text, nullable=False)
    raw_content = Column(Text, nullable=True)
    status = Column(
        BigInteger,
        nullable=False,
    )
    error_message = Column(Text, nullable=True)
