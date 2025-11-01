from sqlalchemy import Column, Integer, String, Boolean
from core.baseEntity.baseEntity import Base, CommonEntity


class UserEntity(Base, CommonEntity):
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
