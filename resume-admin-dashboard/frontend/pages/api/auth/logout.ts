import type { NextApiRequest, NextApiResponse } from 'next';
import { performAdminLogout } from 'lib/server/auth';

type SuccessResponse = { success: true };
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await performAdminLogout({ cookies: req.headers.cookie });
    res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to log out';
    res.status(502).json({ error: message });
  }
}
