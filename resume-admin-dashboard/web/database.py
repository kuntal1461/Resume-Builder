from core.baseEntity.baseEntity import Base, CommonEntity

# Ensure models are registered with SQLAlchemy's metadata
import core.entity.ResumeTemplateEntity  # noqa: F401
import core.entity.ResumeTemplateParentCategoryEntity  # noqa: F401
import core.entity.ResumeTemplateSubCategoryEntity  # noqa: F401
import core.entity.ResumeTemplateVersionEntity  # noqa: F401
import core.entity.AdminUserEntity  # noqa: F401

from backend_common.database import (
    create_engine_from_env,
    create_session_factory,
    get_db_dependency,
    session_scope_factory,
)
from backend_common.database import register_soft_delete_filter

DEFAULT_MYSQL_URL = "mysql+pymysql://resume_user:resume_pass@mysql:3306/resumes?charset=utf8mb4"

engine = create_engine_from_env(
    env_vars=("ADMIN_DASHBOARD_DATABASE_URL", "DATABASE_URL"),
    default_url=DEFAULT_MYSQL_URL,
    disallow_sqlite=True,
)

SessionLocal = create_session_factory(engine)
register_soft_delete_filter(SessionLocal, CommonEntity)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


get_db = get_db_dependency(SessionLocal)
session_scope = session_scope_factory(SessionLocal)
