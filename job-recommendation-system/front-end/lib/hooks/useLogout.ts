import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { getEnvironmentConfig } from '../runtimeConfig';
import { clearAdminProfile } from '../adminProfileStorage';
import { clearWorkspaceProfile } from '../workspaceProfileStorage';
import { clearAccessToken } from '../authTokenStorage';
import { describeNetworkError } from '../networkErrors';

type UseLogoutOptions = {
  redirectTo?: string;
};

type UseLogoutResult = {
  logout: () => Promise<boolean>;
  isLoggingOut: boolean;
  error: string | null;
  resetError: () => void;
};

const DEFAULT_ERROR_MESSAGE = 'Unable to log out. Please try again.';

export function useLogout(options: UseLogoutOptions = {}): UseLogoutResult {
  const { redirectTo = '/' } = options;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    if (isLoggingOut) {
      return false;
    }

    setIsLoggingOut(true);
    setError(null);

    let apiBaseUrl = '';

    const performClientLogout = async () => {
      clearAdminProfile();
      clearWorkspaceProfile();
      clearAccessToken();
      await router.push(redirectTo);
    };

    try {
      const config = await getEnvironmentConfig();
      apiBaseUrl = config.apiBaseUrl;
      const response = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) {
          await performClientLogout();
          return true;
        }

        let message = DEFAULT_ERROR_MESSAGE;
        const payload = await response.json().catch(() => null);
        if (payload && typeof payload === 'object') {
          const detail = (payload as { detail?: unknown }).detail;
          if (typeof detail === 'string' && detail.trim()) {
            message = detail;
          }
        }
        setError(message);
        return false;
      }

      await performClientLogout();
      return true;
    } catch (caughtError) {
      console.error('Logout failed', caughtError);
      const description = describeNetworkError(caughtError, DEFAULT_ERROR_MESSAGE, { apiBaseUrl });
      if (description.isNetworkError) {
        console.warn('API unreachable during logout, clearing local session.', caughtError);
        await performClientLogout();
        return true;
      }

      setError(description.message);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, redirectTo, router]);

  return { logout, isLoggingOut, error, resetError };
}
