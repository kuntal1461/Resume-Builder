from datetime import datetime

from sqlalchemy import Column, String, BigInteger, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class CommonEntity:
    """
    Common columns shared by all admin dashboard entities.
    """

    # 1 = active, other values used for archival or soft-delete semantics
    rowstate = Column(BigInteger, default=1, nullable=False)

    # Generic key/value extension fields
    field1 = Column(String(200), nullable=True)
    field2 = Column(String(200), nullable=True)
    field3 = Column(BigInteger, nullable=True)
    field4 = Column(BigInteger, nullable=True)

    # Audit metadata
    loggedBy = Column(String(100), nullable=True)
    lastUpdatedBy = Column(String(100), nullable=True)
    loggedInTime = Column(DateTime, default=datetime.utcnow)
    lastUpdateTime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
