import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://resume_user:resume_pass@mysql:3306/resumes?charset=utf8"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    future=True,
)
def ping_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return True
