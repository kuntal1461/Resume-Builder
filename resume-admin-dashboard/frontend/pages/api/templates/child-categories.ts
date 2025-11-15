import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchChildCategories, type ChildCategoryListResponse } from '../../../lib/server/resumeTemplates';

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChildCategoryListResponse | ErrorResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const parentIdRaw = req.query.parentId;
  const includeInactive = req.query.includeInactive === 'true';

  const parentId = Array.isArray(parentIdRaw) ? Number(parentIdRaw[0]) : Number(parentIdRaw);
  if (!Number.isFinite(parentId)) {
    res.status(400).json({ error: 'Missing or invalid parentId' });
    return;
  }

  try {
    const response = await fetchChildCategories(parentId, includeInactive);
    res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load child categories';
    res.status(502).json({ error: message });
  }
}

