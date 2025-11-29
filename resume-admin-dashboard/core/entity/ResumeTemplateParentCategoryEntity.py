from sqlalchemy import BigInteger, Column, Integer, String

from core.baseEntity.baseEntity import BaseEntity
from core.constants import TableConstant


class ResumeTemplateParentCategoryEntity(BaseEntity):
    __tablename__ = TableConstant.RESUME_TEMPLATE_PARENT_CATEGORY
    __tablename__ = TableConstant.RESUME_TEMPLATE_PARENT_CATEGORY

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    parent_id = Column(BigInteger, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)
