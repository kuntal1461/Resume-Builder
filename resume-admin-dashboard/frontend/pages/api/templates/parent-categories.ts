import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchParentCategories, type ParentCategoryListResponse } from '../../../lib/server/resumeTemplates';

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParentCategoryListResponse | ErrorResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const includeInactive = req.query.includeInactive === 'true';

  try {
    const response = await fetchParentCategories(includeInactive);
    res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load parent categories';
    res.status(502).json({ error: message });
  }
}
