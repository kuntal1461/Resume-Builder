"""Utilities for bootstrapping SQLAlchemy-backed FastAPI services."""

from dataclasses import dataclass
from importlib import import_module
from typing import Callable, Iterable, Sequence

from sqlalchemy import text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker

from backend_common.database import (
    DEFAULT_MYSQL_URL,
    create_engine_from_env,
    create_session_factory,
    get_db_dependency,
    register_soft_delete_filter,
    session_scope_factory,
)


@dataclass(frozen=True)
class DatabaseBundle:
    """Container for commonly needed database handles."""

    engine: Engine
    session_factory: sessionmaker
    get_db: Callable
    session_scope: Callable


def build_database_bundle(
    *,
    base_entity,
    model_modules: Sequence[str],
    env_vars: Iterable[str] = ("DATABASE_URL",),
    default_url: str = DEFAULT_MYSQL_URL,
    disallow_sqlite: bool = True,
) -> DatabaseBundle:
    """
    Import model modules, create an Engine + Session factory, and wire up dependencies.

    Returns a DatabaseBundle that services can use to register dependencies without
    rewriting the same bootstrap boilerplate everywhere.
    """

    for module_path in model_modules:
        import_module(module_path)

    engine = create_engine_from_env(
        env_vars=env_vars,
        default_url=default_url,
        disallow_sqlite=disallow_sqlite,
    )

    session_factory = create_session_factory(engine)
    register_soft_delete_filter(session_factory, base_entity)

    return DatabaseBundle(
        engine=engine,
        session_factory=session_factory,
        get_db=get_db_dependency(session_factory),
        session_scope=session_scope_factory(session_factory),
    )


def init_database_schema(bundle: DatabaseBundle, base_entity) -> None:
    """Ensure tables exist for the provided Base metadata."""

    base_entity.metadata.create_all(bind=bundle.engine)


def ping_database(bundle: DatabaseBundle) -> None:
    """Emit a lightweight query to confirm the DB connection is alive."""

    with bundle.engine.connect() as conn:
        conn.execute(text("SELECT 1"))
