from sqlalchemy import BigInteger, Boolean, Column, Text

from core.baseEntity.baseEntity import Base, CommonEntity
from core.constants import TableConstant


class JobSourceEntity(Base, CommonEntity):
    """ORM mapping for job_source table."""

    __tablename__ = TableConstant.JOB_SOURCE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    source_name = Column(BigInteger, nullable=False)
    source_url = Column(Text, nullable=True)
    enabled_for_scrapping = Column(Boolean, nullable=False, default=True)
