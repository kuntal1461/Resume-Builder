from dataclasses import dataclass


@dataclass(frozen=True)
class ParentCategoryListRequestVO:
    """Payload describing how parent categories should be fetched."""

    include_inactive: bool = False
