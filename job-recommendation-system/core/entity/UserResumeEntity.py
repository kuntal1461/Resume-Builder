from sqlalchemy import BigInteger, Column, ForeignKey, String

from core.baseEntity.baseEntity import BaseEntity


class UserResumeEntity(BaseEntity):
    __tablename__ = "user_resume"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False,
    )
    template_id = Column(
        BigInteger,
        ForeignKey("resume_template.id"),
        nullable=False,
    )
    user_template_version_no = Column(BigInteger, nullable=True)
    title = Column(String(200), nullable=False)
    current_template_version_id = Column(
        BigInteger,
        ForeignKey("resume_template_version.id"),
        nullable=True,
    )
