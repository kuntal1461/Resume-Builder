import { ADMIN_PROFILE_STORAGE_KEY, type StoredAdminProfile } from '../../../frontend-common/auth';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function persistAdminProfile(profile: StoredAdminProfile): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const payload = JSON.stringify(profile ?? {});
    window.localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, payload);
  } catch (error) {
    console.warn('Unable to persist admin profile in storage', error);
  }
}

export function clearAdminProfile(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(ADMIN_PROFILE_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear admin profile from storage', error);
  }
}
