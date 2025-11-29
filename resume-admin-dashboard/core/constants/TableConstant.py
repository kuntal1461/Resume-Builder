"""Centralized table name definitions used by SQLAlchemy entities."""


class TableConstant:
    """Convenience container for schema table names."""

    USERS = "users"

    RESUME_TEMPLATE_PARENT_CATEGORY = "resume_template_parent_category_master"
    RESUME_TEMPLATE_SUB_CATEGORY = "resume_template_sub_category_master"
    RESUME_TEMPLATE = "resume_template"
    RESUME_TEMPLATE_VERSION = "resume_template_version"

    JOB_MASTER = "job_master"

    COMPANY_MASTER = "company_master"
