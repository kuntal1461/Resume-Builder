"""SQLAlchemy model for job_source table."""

from sqlalchemy import BigInteger, Boolean, Column, Text

from core.baseEntity.baseEntity import BaseEntity
from core.constants.table_constant import TableConstant


class JobSourceEntity(BaseEntity):
    __tablename__ = TableConstant.JOB_SOURCE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    source_name = Column(BigInteger, nullable=False)
    source_url = Column(Text, nullable=True)
    enabled_for_scrapping = Column(Boolean, nullable=False, default=True)
