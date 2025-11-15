from .ResumeTemplateCategoryController import (
    router as template_categories_router,
)
from .ResumeTemplateController import (
    router as template_mutation_router,
)
from .AdminProfileController import (
    router as admin_profile_router,
)

__all__ = [
    "template_categories_router",
    "template_mutation_router",
    "admin_profile_router",
]
