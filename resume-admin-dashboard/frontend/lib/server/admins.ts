import { resolveServerEnvironment } from './environment';

export type AdminProfileResponse = {
  id: number;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isAdmin?: boolean | null;
};

export async function fetchCurrentAdminProfile(): Promise<AdminProfileResponse> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/admins/current', apiBaseUrl);

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(
      `Admin profile fetch failed (status ${response.status}): ${reason || 'unknown error'}`,
    );
  }

  return (await response.json()) as AdminProfileResponse;
}
