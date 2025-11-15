import type { NextApiRequest, NextApiResponse } from 'next';

import {
  fetchTemplateDetail,
  updateTemplate,
  type ResumeTemplateDetailResponse,
  type UpdateTemplateRequest,
  type CreateTemplateResponse,
} from '../../../../lib/server/resumeTemplates';

type ErrorResponse = { error: string };
type SuccessResponse = ResumeTemplateDetailResponse | CreateTemplateResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  const { templateId } = req.query;
  const normalized = Array.isArray(templateId) ? templateId[0] : templateId;
  const idNumber = normalized ? Number(normalized) : NaN;

  if (!Number.isFinite(idNumber)) {
    res.status(400).json({ error: 'Invalid template id' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const response = await fetchTemplateDetail(idNumber);
      res.status(200).json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load template';
      res.status(502).json({ error: message });
    }
    return;
  }

  if (req.method === 'PUT') {
    const payload = req.body as UpdateTemplateRequest;
    try {
      const response = await updateTemplate(idNumber, payload);
      res.status(200).json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update template';
      res.status(502).json({ error: message });
    }
    return;
  }

  res.setHeader('Allow', 'GET, PUT');
  res.status(405).json({ error: 'Method not allowed' });
}
