from sqlalchemy import BigInteger, Column, ForeignKey, String, Text

from core.baseEntity.baseEntity import Base, CommonEntity


class ResumeTemplateEntity(Base, CommonEntity):
    __tablename__ = "resume_template"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    headline = Column(String(255), nullable=True)
    category_id = Column(
        BigInteger,
        ForeignKey("resume_template_sub_category_master.id"),
        nullable=True,
    )
    owner_admin_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, default=0)
    status = Column(BigInteger, nullable=False, default=0)
    preview_pdf_url = Column(Text, nullable=True)
    preview_image_url = Column(Text, nullable=True)
