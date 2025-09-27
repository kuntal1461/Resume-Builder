from dataclasses import dataclass
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from core.baseEntity.baseEntity import Base ,CommonEntity
from core.filters.rowstatus import RowStateFilterMixin

# This is like @Entity . It creates a base class for ORM models.
Base = declarative_base()

@dataclass
class UserEntity(Base , CommonEntity, RowStateFilterMixin): 
    __tablename__ = "users"  # Table name in DB

    # Primary Key with auto increment (same as @Id + @GeneratedValue in JPA)
    id = Column(Integer, primary_key=True, autoincrement=True)
    # Equivalent to @Column(nullable = false, unique = true)
    username      = Column(String(100), unique=True, nullable=False)
    email         = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)

    first_name = Column(String(100), nullable=False)
    last_name  = Column(String(100), nullable=False)

    phone_number = Column(String(32), unique=True, nullable=True)
    is_active    = Column(Boolean, default=True)
    signInBy     = Column(String(50), nullable=True)


    
    