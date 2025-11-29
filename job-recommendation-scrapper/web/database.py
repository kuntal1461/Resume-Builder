"""Database bootstrap helpers for the scrapper API."""

from core.baseEntity.baseEntity import BaseEntity
from backend_common.fastapi_support import build_database_bundle, init_database_schema

db_bundle = build_database_bundle(
    base_entity=BaseEntity,
    model_modules=[
        "core.entity.JobSourceEntity",
        "core.entity.JobRawScrapeEntity",
    ],
    env_vars=("SCRAPPER_DATABASE_URL", "DATABASE_URL"),
)

engine = db_bundle.engine
SessionLocal = db_bundle.session_factory
get_db = db_bundle.get_db
session_scope = db_bundle.session_scope


def init_db() -> None:
    init_database_schema(db_bundle, BaseEntity)
