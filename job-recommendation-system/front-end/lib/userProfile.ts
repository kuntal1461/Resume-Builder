import { getEnvironmentConfig } from './runtimeConfig';

export type UserProfilePayload = {
  userId: number;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
};

const toUserProfilePayload = (data: Record<string, unknown>): UserProfilePayload => {
  const coerceString = (value: unknown): string | null => {
    if (value === null || value === undefined) {
      return null;
    }
    return String(value);
  };

  const coerceNumber = (value: unknown): number => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error('Invalid user id in response.');
    }
    return parsed;
  };

  return {
    userId: coerceNumber(data.user_id ?? data.userId),
    email: coerceString(data.email),
    username: coerceString(data.username),
    firstName: coerceString(data.first_name ?? data.firstName),
    lastName: coerceString(data.last_name ?? data.lastName),
  };
};

export async function lookupUserProfileByEmail(email: string): Promise<UserProfilePayload | null> {
  const trimmed = email.trim();
  if (!trimmed) {
    return null;
  }

  const config = await getEnvironmentConfig();
  const apiBaseUrl = config.apiBaseUrl;

  const response = await fetch(`${apiBaseUrl}/auth/profile?email=${encodeURIComponent(trimmed)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || 'Unable to resolve the user profile from the API.');
  }

  const payload = (await response.json()) as Record<string, unknown>;
  return toUserProfilePayload(payload);
}
