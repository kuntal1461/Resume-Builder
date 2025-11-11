from sqlalchemy import BigInteger, Column, ForeignKey, Integer, String

from core.baseEntity.baseEntity import Base, CommonEntity


class ResumeTemplateSubCategoryEntity(Base, CommonEntity):
    __tablename__ = "resume_template_sub_category_master"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    parent_id = Column(
        BigInteger,
        ForeignKey("resume_template_parent_category_master.id"),
        nullable=True,
    )
    sort_order = Column(Integer, nullable=False, default=0)
