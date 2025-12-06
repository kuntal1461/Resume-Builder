import { resolveServerEnvironment } from './environment';

type LogoutRequestOptions = {
  cookies?: string;
};

const toleratedStatusCodes = new Set([401, 403, 404]);

export async function performAdminLogout(options: LogoutRequestOptions = {}): Promise<void> {
  const { apiBaseUrl } = resolveServerEnvironment();
  const url = new URL('/auth/logout', apiBaseUrl);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (options.cookies) {
    headers.Cookie = options.cookies;
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });

    if (!response.ok && !toleratedStatusCodes.has(response.status)) {
      const reason = await response.text();
      throw new Error(
        `Admin logout failed (status ${response.status}): ${reason || 'unknown error'}`,
      );
    }
  } catch (error) {
    console.warn('Admin logout request failed, ignoring and clearing local session.', error);
  }
}
