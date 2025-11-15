import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchCurrentAdminProfile, type AdminProfileResponse } from '../../../lib/server/admins';

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AdminProfileResponse | ErrorResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const profile = await fetchCurrentAdminProfile();
    res.status(200).json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load admin profile';
    res.status(502).json({ error: message });
  }
}
