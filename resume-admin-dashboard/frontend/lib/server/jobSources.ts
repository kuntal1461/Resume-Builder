import { resolveServerEnvironment } from '../server/environment';
import type {
  EnumOptionRecord,
  JobSourceMetadataResponse,
  JobSourceQueueRequest,
  JobSourceQueueResponse,
} from '../types/jobSources';

export type {
  EnumOptionRecord,
  JobSourceMetadataResponse,
  JobSourceQueueRequest,
  JobSourceQueueResponse,
} from '../types/jobSources';

export async function fetchJobSourceMetadata(): Promise<JobSourceMetadataResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/job-sources/meta', apiBaseUrl);

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Job source metadata fetch failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  const payload = (await response.json()) as JobSourceMetadataResponse;
  return payload;
}

export async function queueJobSourceEntries(
  payload: JobSourceQueueRequest,
): Promise<JobSourceQueueResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/job-sources/queue', apiBaseUrl);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Job source queue failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as JobSourceQueueResponse;
}
