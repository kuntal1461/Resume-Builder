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
