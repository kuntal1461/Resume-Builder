from core.baseEntity.baseEntity import BaseEntity
import core.entity.UserEntity  # noqa: F401  # ensure models are registered
import core.entity.UserResumeEntity  # noqa: F401
import core.entity.UserResumeVersionEntity  # noqa: F401
from backend_common.database import (
    DEFAULT_MYSQL_URL,
    create_engine_from_env,
    create_session_factory,
    get_db_dependency,
    register_soft_delete_filter,
    session_scope_factory,
)

engine = create_engine_from_env(
    env_vars=("DATABASE_URL",),
    default_url=DEFAULT_MYSQL_URL,
    disallow_sqlite=True,
)

SessionLocal = create_session_factory(engine)
register_soft_delete_filter(SessionLocal, BaseEntity)


def init_db() -> None:
    BaseEntity.metadata.create_all(bind=engine)


get_db = get_db_dependency(SessionLocal)
session_scope = session_scope_factory(SessionLocal)
