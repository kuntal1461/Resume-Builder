from dataclasses import dataclass, field
from typing import List, Optional


@dataclass(frozen=True)
class SubCategoryResponseVO:
    """Represents a single resume template sub (child) category."""

    id: int
    name: str
    slug: str
    parent_id: Optional[int]
    sort_order: int


@dataclass(frozen=True)
class SubCategoryListResponseVO:
    """Container for sub categories returned to clients."""

    success: bool
    categories: List[SubCategoryResponseVO] = field(default_factory=list)

