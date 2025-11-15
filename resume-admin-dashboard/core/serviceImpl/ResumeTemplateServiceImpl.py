from sqlalchemy.orm import Session

from ..enums import TemplateState
from ..repository import (
    AdminUserRepository,
    ResumeTemplateParentCategoryRepository,
    ResumeTemplateRepository,
    ResumeTemplateSubCategoryRepository,
    ResumeTemplateVersionRepository,
)
from ..requestVO.CreateResumeTemplateRequestVO import (
    CreateResumeTemplateRequestVO,
)
from ..responseVO.CreateResumeTemplateResponseVO import (
    CreateResumeTemplateResponseVO,
)
from ..responseVO.ResumeTemplateListResponseVO import (
    ResumeTemplateListResponseVO,
    ResumeTemplateSummaryResponseVO,
)
from ..responseVO.ResumeTemplateDetailResponseVO import (
    ResumeTemplateDetailResponseVO,
)
from ..responseVO.ResumeTemplateVersionListResponseVO import (
    ResumeTemplateVersionListResponseVO,
    ResumeTemplateVersionSummaryResponseVO,
)
from ..requestVO.UpdateResumeTemplateRequestVO import (
    UpdateResumeTemplateRequestVO,
)
from ..service.ResumeTemplateService import ResumeTemplateService


class ResumeTemplateServiceImpl(ResumeTemplateService):
    """Default orchestrator for creating resume templates + versions."""

    def __init__(
        self,
        *,
        session: Session,
        template_repo: ResumeTemplateRepository,
        version_repo: ResumeTemplateVersionRepository,
        parent_repo: ResumeTemplateParentCategoryRepository,
        sub_repo: ResumeTemplateSubCategoryRepository,
        user_repo: AdminUserRepository,
    ) -> None:
        self._session = session
        self._template_repo = template_repo
        self._version_repo = version_repo
        self._parent_repo = parent_repo
        self._sub_repo = sub_repo
        self._user_repo = user_repo

    def create_template(
        self,
        request: CreateResumeTemplateRequestVO,
    ) -> CreateResumeTemplateResponseVO:
        parent = self._parent_repo.find_by_slug(request.parent_category_slug)
        if parent is None:
            raise ValueError("Parent category not found.")

        child = self._sub_repo.find_by_slug(request.child_category_slug)
        if child is None:
            raise ValueError("Child category not found.")

        if child.parent_id != parent.id:
            raise ValueError("Child category does not belong to the selected parent.")

        owner = self._user_repo.find_by_email(request.owner_email)
        if owner is None or not getattr(owner, "is_active", True):
            raise ValueError("Owner account not found or inactive.")

        template = self._template_repo.create_template(
            title=request.title,
            category_id=int(child.id),
            owner_admin_id=int(owner.id),
            status=int(request.status),
            owner_email=request.owner_email,
        )

        version = self._version_repo.create_version(
            template_id=int(template.id),
            version_no=request.version_number,
            latex_source=request.latex_source,
            version_label=request.version_label,
        )

        try:
            self._session.commit()
        except Exception:
            self._session.rollback()
            raise

        return CreateResumeTemplateResponseVO(
            success=True,
            template_id=int(template.id),
            template_version_id=int(version.id),
            version_number=int(version.version_no),
        )

    def list_templates_by_status(
        self, status: TemplateState
    ) -> ResumeTemplateListResponseVO:
        templates = self._template_repo.list_templates_by_status(status)
        owner_map = self._user_repo.fetch_by_ids(
            template.owner_admin_id for template in templates
        )

        summaries = []
        for template in templates:
            owner = owner_map.get(int(template.owner_admin_id))
            owner_email = owner.email if owner is not None else None
            owner_name = None
            if owner is not None:
                full_name = " ".join(
                    filter(
                        None,
                        [
                            (owner.first_name or "").strip(),
                            (owner.last_name or "").strip(),
                        ],
                    )
                ).strip()
                owner_name = full_name or owner.username

            last_update_time = (
                template.lastUpdateTime.isoformat()
                if getattr(template, "lastUpdateTime", None)
                else None
            )

            status_label = TemplateState(int(template.status)).status
            summaries.append(
                ResumeTemplateSummaryResponseVO(
                    id=int(template.id),
                    title=template.title,
                    owner_email=owner_email,
                    owner_name=owner_name,
                    status_code=int(template.status),
                    status_label=status_label,
                    last_update_time=last_update_time,
                    preview_image_url=getattr(
                        template, "preview_image_url", None
                    ),
                )
            )

        return ResumeTemplateListResponseVO(success=True, templates=summaries)

    def get_template_detail(
        self, template_id: int
    ) -> ResumeTemplateDetailResponseVO:
        template = self._template_repo.find_by_id(template_id)
        if template is None or template.rowstate != 1:
            raise ValueError("Template not found.")

        latest_version = self._version_repo.fetch_latest_by_template_id(
            int(template.id)
        )
        if latest_version is None:
            raise ValueError("Template version not found.")

        child = None
        parent = None
        if template.category_id:
            child = self._sub_repo.find_by_id(int(template.category_id))
            if child and child.parent_id:
                parent = self._parent_repo.find_by_id(int(child.parent_id))

        owner_lookup = self._user_repo.fetch_by_ids(
            [int(template.owner_admin_id)]
        ).get(int(template.owner_admin_id))
        owner_email = owner_lookup.email if owner_lookup is not None else None

        return ResumeTemplateDetailResponseVO(
            success=True,
            template_id=int(template.id),
            title=template.title,
            parent_category_slug=getattr(parent, "slug", None),
            child_category_slug=getattr(child, "slug", None),
            latex_source=latest_version.latex_source,
            status_code=int(template.status),
            status_label=TemplateState(int(template.status)).status,
            owner_email=owner_email,
            version_number=int(latest_version.version_no)
            if latest_version.version_no is not None
            else None,
            version_label=getattr(latest_version, "field1", None),
        )

    def update_template(
        self,
        template_id: int,
        request: UpdateResumeTemplateRequestVO,
    ) -> CreateResumeTemplateResponseVO:
        template = self._template_repo.find_by_id(template_id)
        if template is None or template.rowstate != 1:
            raise ValueError("Template not found.")

        parent = self._parent_repo.find_by_slug(request.parent_category_slug)
        if parent is None:
            raise ValueError("Parent category not found.")

        child = self._sub_repo.find_by_slug(request.child_category_slug)
        if child is None:
            raise ValueError("Child category not found.")

        if child.parent_id != parent.id:
            raise ValueError("Child category does not belong to the selected parent.")

        owner = self._user_repo.find_by_email(request.owner_email)
        if owner is None or not getattr(owner, "is_active", True):
            raise ValueError("Owner account not found or inactive.")

        template.title = request.title
        template.category_id = int(child.id)
        template.status = int(request.status)
        template.lastUpdatedBy = int(owner.id)

        version = self._version_repo.create_version(
            template_id=int(template.id),
            version_no=request.version_number,
            latex_source=request.latex_source,
            version_label=request.version_label,
        )

        try:
            self._session.commit()
        except Exception:
            self._session.rollback()
            raise

        return CreateResumeTemplateResponseVO(
            success=True,
            template_id=int(template.id),
            template_version_id=int(version.id),
            version_number=int(version.version_no),
        )

    def list_versions_for_template(
        self, template_id: int
    ) -> ResumeTemplateVersionListResponseVO:
        template = self._template_repo.find_by_id(template_id)
        if template is None or template.rowstate != 1:
            raise ValueError("Template not found.")

        versions = self._version_repo.list_by_template_id(template_id)
        summaries = []
        for version in versions:
            last_update_time = (
                version.lastUpdateTime.isoformat()
                if getattr(version, "lastUpdateTime", None)
                else None
            )
            summaries.append(
                ResumeTemplateVersionSummaryResponseVO(
                    id=int(version.id),
                    template_id=int(version.template_id),
                    version_no=int(version.version_no),
                    version_label=getattr(version, "field1", None),
                    last_update_time=last_update_time,
                )
            )

        return ResumeTemplateVersionListResponseVO(
            success=True,
            template_id=int(template_id),
            versions=summaries,
        )
