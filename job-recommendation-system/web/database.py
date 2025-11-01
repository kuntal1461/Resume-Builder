import os
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.baseEntity.baseEntity import Base
import core.entity.UserEntity  # noqa: F401  # ensure models are registered


DEFAULT_MYSQL_URL = (
    "mysql+pymysql://resume_user:resume_pass@mysql:3306/resumes?charset=utf8mb4"
)

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_MYSQL_URL)

if DATABASE_URL.startswith("sqlite"):
    raise RuntimeError(
        "SQLite connections are disabled for this project. "
        "Set DATABASE_URL to a MySQL connection string."
    )

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
