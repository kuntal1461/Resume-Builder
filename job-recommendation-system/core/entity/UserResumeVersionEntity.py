from sqlalchemy import BigInteger, Column, ForeignKey, JSON, Text

from core.baseEntity.baseEntity import Base, CommonEntity


class UserResumeVersionEntity(Base, CommonEntity):
    __tablename__ = "user_resume_version"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_resume_id = Column(
        BigInteger,
        ForeignKey("user_resume.id"),
        nullable=False,
    )
    latex_source_snapshot = Column(Text, nullable=True)
    structured_data_json = Column(JSON, nullable=True)
    render_artifacts_json = Column(JSON, nullable=True)
