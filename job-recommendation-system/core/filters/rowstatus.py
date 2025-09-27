from sqlalchemy import Column, Boolean

class RowStateFilterMixin:
    """
    Ensures queries always apply rowstate <> 1 (like Hibernate @Where).
    Use with SQLAlchemy's with_loader_criteria inside session.py.
    """
    rowstate = Column(Boolean, default=True, nullable=False)