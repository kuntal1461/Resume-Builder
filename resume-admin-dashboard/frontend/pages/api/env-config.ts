import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveServerEnvironment } from '../../lib/server/environment';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const environment = resolveServerEnvironment();
  const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? environment.apiBaseUrl;
  const publicRenderServiceUrl =
    process.env.NEXT_PUBLIC_RENDER_SERVICE_URL ?? environment.renderServiceBaseUrl;

  res.status(200).json({
    ...environment,
    apiBaseUrl: publicApiBaseUrl,
    renderServiceBaseUrl: publicRenderServiceUrl,
  });
}
