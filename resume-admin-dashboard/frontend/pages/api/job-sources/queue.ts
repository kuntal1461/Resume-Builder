import type { NextApiRequest, NextApiResponse } from 'next';

import {
  queueJobSourceEntries,
  type JobSourceQueueRequest,
  type JobSourceQueueResponse,
} from '../../../lib/server/jobSources';

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JobSourceQueueResponse | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const payload = req.body as JobSourceQueueRequest;

  try {
    const response = await queueJobSourceEntries(payload);
    res.status(202).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to queue job sources';
    res.status(502).json({ error: message });
  }
}
