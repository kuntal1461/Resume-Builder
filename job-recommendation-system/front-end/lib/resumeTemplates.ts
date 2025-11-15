export type ResumeTemplateRecord = {
  id: number;
  title: string;
  owner_email: string | null;
  owner_name: string | null;
  status_code: number;
  status_label: string;
  last_update_time: string | null;
  preview_image_url: string | null;
  preview_pdf_url?: string | null;
  parent_category_slug?: string | null;
  parent_category_label?: string | null;
  child_category_slug?: string | null;
  child_category_label?: string | null;
};

export type ResumeTemplateListResponse = {
  success: boolean;
  templates: ResumeTemplateRecord[];
};

export type ResumeTemplateDetailResponse = {
  success: boolean;
  template_id: number;
  title: string;
  parent_category_slug: string | null;
  child_category_slug: string | null;
  latex_source: string;
  status_code: number;
  status_label: string;
  owner_email: string | null;
  owner_name?: string | null;
  version_number: number | null;
  version_label: string | null;
};

export type ResumeTemplateParentCategory = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  sort_order: number;
};

export type ResumeTemplateParentCategoryListResponse = {
  success: boolean;
  categories: ResumeTemplateParentCategory[];
};

const ADMIN_ORIGIN =
  (process.env.NEXT_PUBLIC_RESUME_ADMIN_DASHBOARD_ORIGIN ??
    process.env.RESUME_ADMIN_DASHBOARD_ORIGIN ??
    'http://localhost:3100') as string;

const ADMIN_BASE = ADMIN_ORIGIN.replace(/\/$/, '');

export async function fetchPublishedResumeTemplates(): Promise<ResumeTemplateListResponse> {
  const url = `${ADMIN_BASE}/admin/api/templates?status=published`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Failed to load resume templates (status ${response.status}): ${reason || 'unknown error'}`);
  }

  return (await response.json()) as ResumeTemplateListResponse;
}

export async function fetchResumeTemplateDetail(templateId: number): Promise<ResumeTemplateDetailResponse> {
  const url = `${ADMIN_BASE}/admin/api/templates/${templateId}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Failed to load template detail (status ${response.status}): ${reason || 'unknown error'}`);
  }

  return (await response.json()) as ResumeTemplateDetailResponse;
}

export async function fetchResumeTemplateParentCategories(): Promise<ResumeTemplateParentCategoryListResponse> {
  const url = `${ADMIN_BASE}/admin/api/templates/parent-categories`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Failed to load parent categories (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as ResumeTemplateParentCategoryListResponse;
}
