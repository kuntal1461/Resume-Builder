"""Utility helpers for company_master slug handling."""

import re

from core.repository.company_master_repository import CompanyMasterRepository


def slugify_company_name(name: str) -> str:
    """Create a URL-friendly slug from a company name."""
    base = name.strip().lower()
    base = re.sub(r"[^a-z0-9]+", "-", base)
    base = base.strip("-")
    return base or "company"


def generate_unique_company_slug(
    base_slug: str,
    company_repo: CompanyMasterRepository,
) -> str:
    """Generate a unique slug for company_master, appending a numeric suffix when needed."""
    slug = base_slug
    counter = 1
    while company_repo.find_by_slug(slug) is not None:
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

