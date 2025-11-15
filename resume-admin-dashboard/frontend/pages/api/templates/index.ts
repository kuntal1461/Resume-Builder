import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createTemplate,
  fetchTemplatesByStatus,
  type CreateTemplateRequest,
  type CreateTemplateResponse,
  type ResumeTemplateListResponse,
} from '../../../lib/server/resumeTemplates';

type ErrorResponse = { error: string };

type SuccessResponse = CreateTemplateResponse | ResumeTemplateListResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method === 'GET') {
    const statusParam = req.query.status;
    const status =
      typeof statusParam === 'string'
        ? statusParam
        : Array.isArray(statusParam)
          ? statusParam[0]
          : 'draft';

    try {
      const response = await fetchTemplatesByStatus(status);
      res.status(200).json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load templates';
      res.status(502).json({ error: message });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const payload = req.body as CreateTemplateRequest;

  try {
    const response = await createTemplate(payload);
    res.status(201).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save template';
    res.status(502).json({ error: message });
  }
}
