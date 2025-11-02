import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { getEnvironmentConfig } from '../runtimeConfig';

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

    try {
      const { apiBaseUrl } = await getEnvironmentConfig();
      const response = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) {
          await router.push(redirectTo);
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

      await router.push(redirectTo);
      return true;
    } catch (caughtError) {
      console.error('Logout failed', caughtError);
      setError(caughtError instanceof Error ? caughtError.message : DEFAULT_ERROR_MESSAGE);
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, redirectTo, router]);

  return { logout, isLoggingOut, error, resetError };
}

