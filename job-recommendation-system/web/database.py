from core.baseEntity.baseEntity import BaseEntity
from backend_common.fastapi_support import build_database_bundle, init_database_schema

db_bundle = build_database_bundle(
    base_entity=BaseEntity,
    model_modules=[
        "core.entity.UserEntity",
        "core.entity.UserResumeEntity",
        "core.entity.UserResumeVersionEntity",
    ],
    env_vars=("DATABASE_URL",),
)

engine = db_bundle.engine
SessionLocal = db_bundle.session_factory
get_db = db_bundle.get_db
session_scope = db_bundle.session_scope


def init_db() -> None:
    init_database_schema(db_bundle, BaseEntity)
