from sqlalchemy import BigInteger, Column, ForeignKey, Text, JSON

from core.baseEntity.baseEntity import BaseEntity
from core.constants import TableConstant


class ResumeTemplateVersionEntity(BaseEntity):
    __tablename__ = TableConstant.RESUME_TEMPLATE_VERSION

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    template_id = Column(
        BigInteger,
        ForeignKey(f"{TableConstant.RESUME_TEMPLATE}.id"),
        nullable=False,
    )
    version_no = Column(BigInteger, nullable=False, default=1)
    latex_source = Column(Text, nullable=False)
    assets_manifest_json = Column(JSON, nullable=True)
    changelog = Column(Text, nullable=True)
