from sqlalchemy import BigInteger, Column, String, Text

from core.baseEntity.baseEntity import Base, CommonEntity
from core.constants import TableConstant


class CompanyMasterEntity(Base, CommonEntity):
    """ORM mapping for company_master table."""

    __tablename__ = TableConstant.COMPANY_MASTER

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    company_name = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)
    logo_url = Column(Text, nullable=True)
    website_url = Column(Text, nullable=True)
    slug = Column(String(255), nullable=False, unique=True)
