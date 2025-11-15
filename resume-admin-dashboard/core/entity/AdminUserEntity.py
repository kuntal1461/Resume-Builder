from sqlalchemy import BigInteger, Column, String, Boolean

from core.baseEntity.baseEntity import Base, CommonEntity


class AdminUserEntity(Base, CommonEntity):
    """Lightweight mapping to the shared users table for owner lookups."""

    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    username = Column(String(255), nullable=False, unique=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    is_admin = Column(Boolean, nullable=False, default=False)
