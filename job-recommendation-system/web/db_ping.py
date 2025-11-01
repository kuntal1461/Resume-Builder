from sqlalchemy import text

from .database import engine


def ping_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return True
