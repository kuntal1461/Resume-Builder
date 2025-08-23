from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

# This is like @Entity . It creates a base class for ORM models.
Base = declarative_base()

@dataclass
class UserEntity(Base): 
    __tablename__ = "users"  # Table name in DB

    # Primary Key with auto increment (same as @Id + @GeneratedValue in JPA)
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Equivalent to @Column(nullable = false, unique = true)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)

    # Mandatory field
    password_hash = Column(String, nullable=False)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    # Timestamps (default to current time)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    phone_number = Column(String,unique=True, nullable=True)
    is_active = Column(Boolean, default=True)
    signInBy = Column(String, nullable=True)

    
    