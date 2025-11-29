"""Utility to check database connectivity."""

from backend_common.fastapi_support import ping_database

from .database import db_bundle


def ping_db() -> bool:
    ping_database(db_bundle)
    return True
