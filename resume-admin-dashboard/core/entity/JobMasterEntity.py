from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Numeric, String, Text

from core.baseEntity.baseEntity import Base, CommonEntity
from core.constants import TableConstant


class JobMasterEntity(Base, CommonEntity):
    """ORM mapping for job_master table."""

    __tablename__ = TableConstant.JOB_MASTER

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    external_job_id = Column(String(255), nullable=True)
    job_url = Column(Text, nullable=False)
    source_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.JOB_SOURCE}.id"),
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    company_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.COMPANY_MASTER}.id"),
        nullable=True,
    )
    location = Column(String(255), nullable=True)
    employment_type = Column(BigInteger, nullable=True)
    experience_required = Column(String(255), nullable=True)
    salary_min = Column(Numeric(15, 2), nullable=True)
    salary_max = Column(Numeric(15, 2), nullable=True)
    job_description = Column(Text, nullable=True)
    posted_date = Column(DateTime, nullable=True)
