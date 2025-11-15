from sqlalchemy import BigInteger, Column, ForeignKey, Text, JSON

from core.baseEntity.baseEntity import Base, CommonEntity


class ResumeTemplateVersionEntity(Base, CommonEntity):
    __tablename__ = "resume_template_version"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    template_id = Column(
        BigInteger,
        ForeignKey("resume_template.id"),
        nullable=False,
    )
    version_no = Column(BigInteger, nullable=False, default=1)
    latex_source = Column(Text, nullable=False)
    assets_manifest_json = Column(JSON, nullable=True)
    changelog = Column(Text, nullable=True)
