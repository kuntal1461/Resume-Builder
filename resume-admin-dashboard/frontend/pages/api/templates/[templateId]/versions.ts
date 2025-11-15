import type { NextApiRequest, NextApiResponse } from 'next';

import {
  fetchTemplateVersions,
  type ResumeTemplateVersionListResponse,
} from '../../../../lib/server/resumeTemplates';

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResumeTemplateVersionListResponse | ErrorResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { templateId } = req.query;
  const normalized = Array.isArray(templateId) ? templateId[0] : templateId;
  const idNumber = normalized ? Number(normalized) : NaN;

  if (!Number.isFinite(idNumber)) {
    res.status(400).json({ error: 'Invalid template id' });
    return;
  }

  try {
    const response = await fetchTemplateVersions(idNumber);
    res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load template versions';
    res.status(502).json({ error: message });
  }
}
