const ACCESS_TOKEN_STORAGE_KEY = 'jobmatch.accessToken';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function persistAccessToken(token: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.warn('Unable to persist access token', error);
  }
}

export function loadAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to load access token', error);
    return null;
  }
}

export function clearAccessToken(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear access token', error);
  }
}
