from datetime import datetime

from sqlalchemy import Column, String, BigInteger, DateTime


class BaseEntityMixin:
  """
  Reusable mixin for soft-delete + audit fields.
  Projects should define their own declarative Base and create a
  local BaseEntity that extends this mixin to keep imports stable:

      from sqlalchemy.orm import declarative_base
      from backend_common.orm.common import BaseEntityMixin

      BaseEntity = declarative_base(cls=BaseEntityMixin)
  """

  __abstract__ = True

  # 1 = active (or other positive states), -1 = soft-deleted
  rowstate = Column(BigInteger, default=1, nullable=False)

  # Generic key/value extension fields
  field1 = Column(String(200), nullable=True)
  field2 = Column(String(200), nullable=True)
  field3 = Column(BigInteger, nullable=True)
  field4 = Column(BigInteger, nullable=True)

  # Audit metadata
  loggedBy = Column(BigInteger, nullable=False, default=0)
  lastUpdatedBy = Column(BigInteger, nullable=False, default=0)
  loggedInTime = Column(DateTime, default=datetime.utcnow)
  lastUpdateTime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
