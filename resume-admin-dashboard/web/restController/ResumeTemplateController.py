from dataclasses import asdict
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from sqlalchemy.orm import Session

from core.requestVO import (
    CreateResumeTemplateRequestVO,
    UpdateResumeTemplateRequestVO,
)
from core.repository import (
    AdminUserRepository,
    ResumeTemplateParentCategoryRepository,
    ResumeTemplateRepository,
    ResumeTemplateSubCategoryRepository,
    ResumeTemplateVersionRepository,
)
from core.responseVO import (
    CreateResumeTemplateResponseVO,
    ResumeTemplateListResponseVO,
    ResumeTemplateDetailResponseVO,
    ResumeTemplateVersionListResponseVO,
)
from core.service import ResumeTemplateService
from core.serviceImpl import ResumeTemplateServiceImpl
from core.enums import TemplateState

from ..database import get_db

router = APIRouter(prefix="/templates", tags=["templates"])


def get_template_service(
    db: Session = Depends(get_db),
) -> ResumeTemplateService:
    parent_repo = ResumeTemplateParentCategoryRepository(db)
    sub_repo = ResumeTemplateSubCategoryRepository(db)
    template_repo = ResumeTemplateRepository(db)
    version_repo = ResumeTemplateVersionRepository(db)
    user_repo = AdminUserRepository(db)
    return ResumeTemplateServiceImpl(
        session=db,
        template_repo=template_repo,
        version_repo=version_repo,
        parent_repo=parent_repo,
        sub_repo=sub_repo,
        user_repo=user_repo,
    )


class CreateTemplatePayload(BaseModel):
    name: str
    ownerEmail: EmailStr
    parentCategorySlug: str
    childCategorySlug: str
    versionLabel: str
    latexSource: str
    status: str | None = "draft"

    model_config = ConfigDict(extra="forbid")

    @field_validator(
        "name",
        "parentCategorySlug",
        "childCategorySlug",
        "versionLabel",
        "latexSource",
    )
    @classmethod
    def _ensure_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("must not be empty")
        return cleaned


class UpdateTemplatePayload(BaseModel):
    name: str
    ownerEmail: EmailStr
    parentCategorySlug: str
    childCategorySlug: str
    versionLabel: str
    latexSource: str
    status: str | None = "draft"

    model_config = ConfigDict(extra="forbid")

    @field_validator(
        "name",
        "parentCategorySlug",
        "childCategorySlug",
        "versionLabel",
        "latexSource",
    )
    @classmethod
    def _ensure_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("must not be empty")
        return cleaned


def _derive_version_number(label: str) -> int:
    normalized = label.strip()
    if normalized.lower().startswith("v"):
        normalized = normalized[1:]

    normalized = normalized.strip()
    if not normalized:
        raise ValueError("Version label is empty.")

    parts = normalized.split(".")
    if not all(part.isdigit() for part in parts):
        raise ValueError("Version label must contain digits or '.' only.")

    version_number = 0
    for part in parts:
        version_number = version_number * 1000 + int(part)

    if version_number <= 0:
        raise ValueError("Version number must be greater than zero.")

    return version_number


@router.post("", status_code=status.HTTP_201_CREATED)
def create_template(
    payload: CreateTemplatePayload,
    service: ResumeTemplateService = Depends(get_template_service),
):
    status_value = (payload.status or "draft").strip().upper()
    try:
        status_enum = TemplateState[status_value]
    except KeyError as exc:
        valid_states = ", ".join(state.name.lower() for state in TemplateState)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{payload.status}'. Expected one of: {valid_states}.",
        ) from exc

    try:
        version_number = _derive_version_number(payload.versionLabel)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    request = CreateResumeTemplateRequestVO(
        title=payload.name,
        owner_email=str(payload.ownerEmail),
        parent_category_slug=payload.parentCategorySlug,
        child_category_slug=payload.childCategorySlug,
        version_label=payload.versionLabel,
        version_number=version_number,
        latex_source=payload.latexSource,
        status=status_enum,
    )

    try:
        response = service.create_template(request)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc) or "Unable to save template.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail="Failed to save template."
        ) from exc

    if isinstance(response, CreateResumeTemplateResponseVO):
        return asdict(response)
    return response


@router.get("")
def list_templates(
    status: Optional[str] = Query("draft", description="Template status filter."),
    service: ResumeTemplateService = Depends(get_template_service),
):
    status_param = (status or "draft").strip().upper()
    try:
        status_enum = TemplateState[status_param]
    except KeyError as exc:
        valid_states = ", ".join(state.name.lower() for state in TemplateState)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status}'. Expected one of: {valid_states}.",
        ) from exc

    response = service.list_templates_by_status(status_enum)
    if isinstance(response, ResumeTemplateListResponseVO):
        return asdict(response)
    return response


@router.get("/{template_id}")
def get_template_detail(
    template_id: int,
    service: ResumeTemplateService = Depends(get_template_service),
):
    try:
        response = service.get_template_detail(template_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc) or "Template not found.") from exc

    if isinstance(response, ResumeTemplateDetailResponseVO):
        return asdict(response)
    return response


@router.get("/{template_id}/versions")
def list_template_versions(
    template_id: int,
    service: ResumeTemplateService = Depends(get_template_service),
):
    try:
        response = service.list_versions_for_template(template_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc) or "Template not found.") from exc

    if isinstance(response, ResumeTemplateVersionListResponseVO):
        return asdict(response)
    return response


@router.put("/{template_id}")
def update_template(
    template_id: int,
    payload: UpdateTemplatePayload,
    service: ResumeTemplateService = Depends(get_template_service),
):
    status_value = (payload.status or "draft").strip().upper()
    try:
        status_enum = TemplateState[status_value]
    except KeyError as exc:
        valid_states = ", ".join(state.name.lower() for state in TemplateState)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{payload.status}'. Expected one of: {valid_states}.",
        ) from exc

    try:
        version_number = _derive_version_number(payload.versionLabel)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    request = UpdateResumeTemplateRequestVO(
        title=payload.name,
        owner_email=str(payload.ownerEmail),
        parent_category_slug=payload.parentCategorySlug,
        child_category_slug=payload.childCategorySlug,
        version_label=payload.versionLabel,
        version_number=version_number,
        latex_source=payload.latexSource,
        status=status_enum,
    )

    try:
        response = service.update_template(template_id, request)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc) or "Unable to update template.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail="Failed to update template."
        ) from exc

    if isinstance(response, CreateResumeTemplateResponseVO):
        return asdict(response)
    return response
