import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveServerEnvironment } from '../../lib/server/environment';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const environment = resolveServerEnvironment();
  res.status(200).json(environment);
}
