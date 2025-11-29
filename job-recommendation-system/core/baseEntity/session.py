# core/database/session.py
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker, with_loader_criteria

from core.baseEntity.baseEntity import BaseEntity
from core.filters.rowstatus import RowStateFilterMixin

# configure your DB
ENGINE_URL = "sqlite:///app.db"   # change to mysql+pymysql://user:pwd@host/db
engine = create_engine(ENGINE_URL, echo=False, future=True)

SessionLocal = sessionmaker(bind=engine, class_=Session, future=True)

@event.listens_for(Session, "do_orm_execute")
def _apply_rowstate_filter(execute_state):
    """
    Global filter: automatically excludes rows with rowstate == 1.
    Equivalent to @Where("rowstate <> 1") in Hibernate.
    """
    if not execute_state.is_select:
        return
    if execute_state.execution_options.get("bypass_rowstate_filter"):
        return

    execute_state.statement = execute_state.statement.options(
        with_loader_criteria(RowStateFilterMixin, lambda cls: cls.rowstate != 1, include_aliases=True)
    )
