import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { clearStoredSidebarProfile } from './sidebarProfile';
import { clearCachedAdminProfile } from './useSidebarProfile';

type UseAdminLogoutOptions = {
  redirectTo?: string;
};

type UseAdminLogoutResult = {
  logout: () => Promise<boolean>;
  isLoggingOut: boolean;
  error: string | null;
};

const DEFAULT_ERROR_MESSAGE = 'Unable to log out. Please try again.';
const toleratedStatusCodes = new Set([401, 403, 404]);

const ACCESS_TOKEN_STORAGE_KEY = 'jobmatch.accessToken';
const WORKSPACE_PROFILE_STORAGE_KEY = 'jobmatch.workspaceProfile';

const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const clearAccessToken = (): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear access token during admin logout', error);
  }
};

const clearWorkspaceProfile = (): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(WORKSPACE_PROFILE_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear workspace profile during admin logout', error);
  }
};

const ensureLeadingSlash = (value: string): string => {
  if (!value) {
    return '';
  }
  return value.startsWith('/') ? value : `/${value}`;
};

const resolveErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { error?: unknown; detail?: unknown };
    const detail =
      typeof payload?.error === 'string'
        ? payload.error.trim()
        : typeof payload?.detail === 'string'
          ? payload.detail.trim()
          : '';
    return detail || DEFAULT_ERROR_MESSAGE;
  } catch (_error) {
    return DEFAULT_ERROR_MESSAGE;
  }
};

export function useAdminLogout(options: UseAdminLogoutOptions = {}): UseAdminLogoutResult {
  const { redirectTo = '/view' } = options;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLocalCleanup = useCallback(async () => {
    clearCachedAdminProfile();
    clearStoredSidebarProfile();
    clearAccessToken();
    clearWorkspaceProfile();

    const target = ensureLeadingSlash(redirectTo.trim());
    if (!target) {
      return;
    }

    try {
      await router.push(target);
    } catch (navigationError) {
      console.warn('Failed to navigate after logout, forcing reload.', navigationError);
      if (typeof window !== 'undefined') {
        const basePath = router.basePath ?? '';
        window.location.href = `${basePath}${target}`;
      }
    }
  }, [redirectTo, router]);

  const logout = useCallback(async () => {
    if (isLoggingOut) {
      return false;
    }

    setIsLoggingOut(true);
    setError(null);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const logoutEndpoint = `${basePath}/api/auth/logout`;

    try {
      const response = await fetch(logoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok || toleratedStatusCodes.has(response.status)) {
        await performLocalCleanup();
        return true;
      }

      const message = await resolveErrorMessage(response);
      setError(message);
      return false;
    } catch (caughtError) {
      console.error('Logout request failed, clearing local session.', caughtError);
      await performLocalCleanup();
      return true;
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, performLocalCleanup]);

  return { logout, isLoggingOut, error };
}
