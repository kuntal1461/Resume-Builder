from abc import ABC, abstractmethod

from ..enums import TemplateState
from ..requestVO.CreateResumeTemplateRequestVO import (
    CreateResumeTemplateRequestVO,
)
from ..requestVO.UpdateResumeTemplateRequestVO import (
    UpdateResumeTemplateRequestVO,
)
from ..responseVO.CreateResumeTemplateResponseVO import (
    CreateResumeTemplateResponseVO,
)
from ..responseVO.ResumeTemplateListResponseVO import (
    ResumeTemplateListResponseVO,
)
from ..responseVO.ResumeTemplateDetailResponseVO import (
    ResumeTemplateDetailResponseVO,
)
from ..responseVO.ResumeTemplateVersionListResponseVO import (
    ResumeTemplateVersionListResponseVO,
)


class ResumeTemplateService(ABC):
    """Contract for operations on resume templates."""

    @abstractmethod
    def create_template(
        self,
        request: CreateResumeTemplateRequestVO,
    ) -> CreateResumeTemplateResponseVO:
        """Persist a resume template and its first version."""
        raise NotImplementedError

    @abstractmethod
    def list_templates_by_status(
        self, status: TemplateState
    ) -> ResumeTemplateListResponseVO:
        """Return templates filtered by the provided state."""
        raise NotImplementedError

    @abstractmethod
    def get_template_detail(
        self, template_id: int
    ) -> ResumeTemplateDetailResponseVO:
        """Return the latest version + metadata for a template."""
        raise NotImplementedError

    @abstractmethod
    def update_template(
        self,
        template_id: int,
        request: UpdateResumeTemplateRequestVO,
    ) -> CreateResumeTemplateResponseVO:
        """Update template metadata while appending a new version row."""
        raise NotImplementedError

    @abstractmethod
    def list_versions_for_template(
        self, template_id: int
    ) -> ResumeTemplateVersionListResponseVO:
        """Return the ordered version history for a template."""
        raise NotImplementedError
