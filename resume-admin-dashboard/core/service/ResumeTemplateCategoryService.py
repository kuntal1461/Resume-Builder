from abc import ABC, abstractmethod

from ..requestVO.ParentCategoryListRequestVO import ParentCategoryListRequestVO
from ..requestVO.SubCategoryListRequestVO import SubCategoryListRequestVO
from ..responseVO.ParentCategoryResponseVO import ParentCategoryListResponseVO
from ..responseVO.SubCategoryResponseVO import SubCategoryListResponseVO


class ResumeTemplateCategoryService(ABC):
    """Unified contract for fetching resume template categories."""

    @abstractmethod
    def list_parent_categories(
        self, request: ParentCategoryListRequestVO
    ) -> ParentCategoryListResponseVO:
        """Return parent categories honoring the provided filters."""
        raise NotImplementedError

    @abstractmethod
    def list_sub_categories(
        self, request: SubCategoryListRequestVO
    ) -> SubCategoryListResponseVO:
        """Return sub (child) categories honoring the provided filters."""
        raise NotImplementedError

