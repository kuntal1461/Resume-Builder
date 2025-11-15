import os
from contextlib import contextmanager
from typing import Iterable, Optional, Callable, Generator

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session, with_loader_criteria

DEFAULT_MYSQL_URL = "mysql+pymysql://resume_user:resume_pass@mysql:3306/resumes?charset=utf8mb4"


def _resolve_database_url(
    env_vars: Iterable[str],
    default_url: Optional[str],
) -> str:
    for variable in env_vars:
        if not variable:
            continue
        value = os.getenv(variable)
        if value:
            return value

    if default_url:
        return default_url

    raise RuntimeError(
        f"Database URL not configured. Set one of: {', '.join(env_vars)} "
        f"or provide a default_url."
    )


def create_engine_from_env(
    env_vars: Iterable[str] = ("DATABASE_URL",),
    default_url: Optional[str] = DEFAULT_MYSQL_URL,
    *,
    disallow_sqlite: bool = True,
) -> Engine:
    database_url = _resolve_database_url(env_vars, default_url)

    if disallow_sqlite and database_url.startswith("sqlite"):
        raise RuntimeError(
            "SQLite connections are disabled for this project. "
            "Set DATABASE_URL to a MySQL connection string."
        )

    return create_engine(
        database_url,
        pool_pre_ping=True,
        pool_recycle=3600,
        future=True,
    )


def create_session_factory(engine: Engine) -> sessionmaker:
    return sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=False,
        future=True,
    )


def get_db_dependency(session_factory: sessionmaker) -> Callable[[], Generator[Session, None, None]]:
    def _get_db():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    return _get_db


def session_scope_factory(session_factory: sessionmaker):
    @contextmanager
    def _session_scope():
        db = session_factory()
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    return _session_scope


__all__ = [
    "create_engine_from_env",
    "create_session_factory",
    "get_db_dependency",
    "session_scope_factory",
    "register_soft_delete_filter",
]


def register_soft_delete_filter(
    session_factory: sessionmaker,
    base_class,
    *,
    field_name: str = "rowstate",
    deleted_value: int = -1,
) -> None:
    """
    Register a global soft-delete filter for all SELECTs involving the given base_class
    (and its subclasses). The filter excludes rows where base_class.<field_name> == deleted_value.

    Safe to call multiple times; subsequent calls are no-ops for the same session_factory.
    """

    if getattr(session_factory, "_soft_delete_filter_registered", False):
        return

    @event.listens_for(session_factory, "do_orm_execute")
    def _add_soft_delete_filter(execute_state):
        if execute_state.is_select:
            # SQLAlchemy's lambda criteria tracker doesn't support getattr on a dynamic
            # attribute name. We rely on a conventional column name 'rowstate'.
            execute_state.statement = execute_state.statement.options(
                with_loader_criteria(
                    base_class,
                    lambda cls: cls.rowstate != deleted_value,
                    include_aliases=True,
                )
            )

    setattr(session_factory, "_soft_delete_filter_registered", True)
