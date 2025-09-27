from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, BigInteger, DateTime
from datetime import datetime

Base = declarative_base()

class CommonEntity:
    """
    Common columns shared by all entities.
    Extend this in your entities along with Base.
    """
    # rowstate flag (True/False or 1/0 depending on DB convention)
    rowstate = Column(BigInteger, default=1, nullable=False)  

    # generic fields
    field1 = Column(String(200), nullable=True)
    field2 = Column(String(200), nullable=True)
    field3 = Column(BigInteger, nullable=True)
    field4 = Column(BigInteger, nullable=True)

    # audit fields
    loggedBy = Column(String(100), nullable=True)
    lastUpdatedBy = Column(String(100), nullable=True)
    loggedInTime = Column(DateTime, default=datetime.utcnow)
    lastUpdateTime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
