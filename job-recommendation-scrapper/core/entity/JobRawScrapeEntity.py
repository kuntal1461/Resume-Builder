"""SQLAlchemy model definition for job_raw_scrape rows."""

from sqlalchemy import BigInteger, Column, ForeignKey, Text
from sqlalchemy.orm import relationship

from core.baseEntity.baseEntity import BaseEntity
from core.constants.table_constant import TableConstant


class JobRawScrapeEntity(BaseEntity):
    """Captures the raw content fetched for a job posting."""

    __tablename__ = TableConstant.JOB_RAW_SCRAPE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    source_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.JOB_SOURCE}.id", name="fk_job_raw_scrape_source"),
        nullable=False,
    )
    job_url = Column(Text, nullable=False)
    raw_content = Column(Text, nullable=True)
    status = Column(BigInteger, nullable=True)
    error_message = Column(Text, nullable=True)

    source = relationship(
        "JobSourceEntity",
        lazy="joined",
        backref="raw_scrapes",
    )

