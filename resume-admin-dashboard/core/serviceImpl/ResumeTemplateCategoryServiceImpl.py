from ..repository.ResumeTemplateParentCategoryRepository import (
    ResumeTemplateParentCategoryRepository,
)
from ..repository.ResumeTemplateSubCategoryRepository import (
    ResumeTemplateSubCategoryRepository,
)
from ..requestVO.ParentCategoryListRequestVO import ParentCategoryListRequestVO
from ..requestVO.SubCategoryListRequestVO import SubCategoryListRequestVO
from ..responseVO.ParentCategoryResponseVO import (
    ParentCategoryListResponseVO,
    ParentCategoryResponseVO,
)
from ..responseVO.SubCategoryResponseVO import (
    SubCategoryListResponseVO,
    SubCategoryResponseVO,
)
from ..service.ResumeTemplateCategoryService import (
    ResumeTemplateCategoryService,
)


class ResumeTemplateCategoryServiceImpl(ResumeTemplateCategoryService):
    """Default service that fetches parent and sub categories via SQLAlchemy."""

    def __init__(
        self,
        parent_repo: ResumeTemplateParentCategoryRepository,
        sub_repo: ResumeTemplateSubCategoryRepository,
    ) -> None:
        self._parent_repo = parent_repo
        self._sub_repo = sub_repo

    def list_parent_categories(
        self, request: ParentCategoryListRequestVO
    ) -> ParentCategoryListResponseVO:
        entities = self._parent_repo.list_parent_categories(
            include_inactive=request.include_inactive
        )

        categories = [
            ParentCategoryResponseVO(
                id=int(entity.id),
                name=entity.name,
                slug=entity.slug,
                parent_id=int(entity.parent_id) if entity.parent_id is not None else None,
                sort_order=int(entity.sort_order or 0),
            )
            for entity in entities
        ]

        return ParentCategoryListResponseVO(success=True, categories=categories)

    def list_sub_categories(
        self, request: SubCategoryListRequestVO
    ) -> SubCategoryListResponseVO:
        if request.parent_id is None:
            return SubCategoryListResponseVO(success=True, categories=[])

        entities = self._sub_repo.list_sub_categories(
            include_inactive=request.include_inactive,
            parent_id=request.parent_id,
        )

        categories = [
            SubCategoryResponseVO(
                id=int(entity.id),
                name=entity.name,
                slug=entity.slug,
                parent_id=int(entity.parent_id) if entity.parent_id is not None else None,
                sort_order=int(entity.sort_order or 0),
            )
            for entity in entities
        ]

        return SubCategoryListResponseVO(success=True, categories=categories)

