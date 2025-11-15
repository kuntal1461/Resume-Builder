import { resolveServerEnvironment } from './environment';

export type ParentCategoryRecord = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  sort_order: number;
};

export type ParentCategoryListResponse = {
  success: boolean;
  categories: ParentCategoryRecord[];
};

export type ChildCategoryRecord = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  sort_order: number;
};

export type ChildCategoryListResponse = {
  success: boolean;
  categories: ChildCategoryRecord[];
};

export type TemplateStatus = 'draft' | 'published' | 'archive';

export type CreateTemplateRequest = {
  name: string;
  ownerEmail: string;
  parentCategorySlug: string;
  childCategorySlug: string;
  versionLabel: string;
  latexSource: string;
  status?: TemplateStatus;
};

export type CreateTemplateResponse = {
  success: boolean;
  template_id: number;
  template_version_id: number;
  version_number: number;
};

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

export type ResumeTemplateDetail = {
  template_id: number;
  title: string;
  parent_category_slug: string | null;
  child_category_slug: string | null;
  latex_source: string;
  status_code: number;
  status_label: string;
  owner_email: string | null;
  version_number: number | null;
  version_label: string | null;
};

export type ResumeTemplateDetailResponse = {
  success: boolean;
} & ResumeTemplateDetail;

export type UpdateTemplateRequest = {
  name: string;
  ownerEmail: string;
  parentCategorySlug: string;
  childCategorySlug: string;
  versionLabel: string;
  latexSource: string;
  status?: TemplateStatus;
};

export type ResumeTemplateVersionRecord = {
  id: number;
  template_id: number;
  version_no: number;
  version_label: string | null;
  last_update_time: string | null;
};

export type ResumeTemplateVersionListResponse = {
  success: boolean;
  template_id: number;
  versions: ResumeTemplateVersionRecord[];
};

export async function fetchParentCategories(
  includeInactive = false,
): Promise<ParentCategoryListResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/templates/parent-categories', apiBaseUrl);
  if (includeInactive) {
    url.searchParams.set('includeInactive', 'true');
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Parent category fetch failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as ParentCategoryListResponse;
}

export async function fetchChildCategories(
  parentId: number,
  includeInactive = false,
): Promise<ChildCategoryListResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/templates/child-categories', apiBaseUrl);
  url.searchParams.set('parentId', String(parentId));
  if (includeInactive) {
    url.searchParams.set('includeInactive', 'true');
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Child category fetch failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as ChildCategoryListResponse;
}

export async function createTemplate(
  payload: CreateTemplateRequest,
): Promise<CreateTemplateResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/templates', apiBaseUrl);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Template create failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as CreateTemplateResponse;
}

export async function fetchTemplatesByStatus(
  status = 'draft',
): Promise<ResumeTemplateListResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/templates', apiBaseUrl);
  if (status) {
    url.searchParams.set('status', status);
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Template list failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as ResumeTemplateListResponse;
}

export async function fetchTemplateDetail(
  templateId: number,
): Promise<ResumeTemplateDetailResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL(`/templates/${templateId}`, apiBaseUrl);

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Template fetch failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as ResumeTemplateDetailResponse;
}

export async function updateTemplate(
  templateId: number,
  payload: UpdateTemplateRequest,
): Promise<CreateTemplateResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL(`/templates/${templateId}`, apiBaseUrl);

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Template update failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as CreateTemplateResponse;
}

export async function fetchTemplateVersions(
  templateId: number,
): Promise<ResumeTemplateVersionListResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL(`/templates/${templateId}/versions`, apiBaseUrl);

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Template versions fetch failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as ResumeTemplateVersionListResponse;
}
