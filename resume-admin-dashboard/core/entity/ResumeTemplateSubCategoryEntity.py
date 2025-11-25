from sqlalchemy import BigInteger, Column, ForeignKey, Integer, String

from core.baseEntity.baseEntity import Base, CommonEntity
from core.constants import TableConstant


class ResumeTemplateSubCategoryEntity(Base, CommonEntity):
    __tablename__ = TableConstant.RESUME_TEMPLATE_SUB_CATEGORY

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    parent_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.RESUME_TEMPLATE_PARENT_CATEGORY}.id"),
        nullable=True,
    )
    sort_order = Column(Integer, nullable=False, default=0)
