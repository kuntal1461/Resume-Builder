from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class ParentCategoryResponseVO:
    """Represents a single resume template parent category."""

    id: int
    name: str
    slug: str
    parent_id: Optional[int]
    sort_order: int


@dataclass(frozen=True)
class ParentCategoryListResponseVO:
    """Container for parent categories returned to clients."""

    success: bool
    categories: List[ParentCategoryResponseVO] = field(default_factory=list)
