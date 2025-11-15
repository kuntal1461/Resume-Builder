from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SubCategoryListRequestVO:
    """Payload describing how sub (child) categories should be fetched."""

    include_inactive: bool = False
    parent_id: Optional[int] = None

