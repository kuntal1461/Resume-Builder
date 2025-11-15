from dataclasses import asdict
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from core.requestVO import ParentCategoryListRequestVO
from core.requestVO.SubCategoryListRequestVO import SubCategoryListRequestVO
from core.service.ResumeTemplateCategoryService import ResumeTemplateCategoryService
from core.repository import (
    ResumeTemplateParentCategoryRepository,
    ResumeTemplateSubCategoryRepository,
)
from core.serviceImpl.ResumeTemplateCategoryServiceImpl import (
    ResumeTemplateCategoryServiceImpl,
)
from ..database import get_db

router = APIRouter(prefix="/templates", tags=["templates"])


def get_category_service(
    db: Session = Depends(get_db),
) -> ResumeTemplateCategoryService:
    parent_repo = ResumeTemplateParentCategoryRepository(db)
    sub_repo = ResumeTemplateSubCategoryRepository(db)
    return ResumeTemplateCategoryServiceImpl(parent_repo, sub_repo)


@router.get("/parent-categories")
def list_parent_categories(
    include_inactive: bool = Query(False, alias="includeInactive"),
    service: ResumeTemplateCategoryService = Depends(get_category_service),
):
    request = ParentCategoryListRequestVO(include_inactive=include_inactive)
    response = service.list_parent_categories(request)
    return asdict(response)


@router.get("/child-categories")
def list_child_categories(
    parent_id: Optional[int] = Query(None, alias="parentId"),
    include_inactive: bool = Query(False, alias="includeInactive"),
    service: ResumeTemplateCategoryService = Depends(get_category_service),
):
    request = SubCategoryListRequestVO(
        include_inactive=include_inactive, parent_id=parent_id
    )
    response = service.list_sub_categories(request)
    return asdict(response)
