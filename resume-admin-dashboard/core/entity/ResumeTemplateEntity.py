from sqlalchemy import BigInteger, Column, ForeignKey, String, Text

from core.baseEntity.baseEntity import Base, CommonEntity
from core.constants import TableConstant


class ResumeTemplateEntity(Base, CommonEntity):
    __tablename__ = TableConstant.RESUME_TEMPLATE

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    headline = Column(String(255), nullable=True)
    category_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.RESUME_TEMPLATE_SUB_CATEGORY}.id"),
        nullable=True,
    )
    owner_admin_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.USERS}.id"),
        nullable=False,
        default=0,
    )
    status = Column(BigInteger, nullable=False, default=0)
    preview_pdf_url = Column(Text, nullable=True)
    preview_image_url = Column(Text, nullable=True)
