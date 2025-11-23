export const WORKSPACE_PROFILE_STORAGE_KEY = 'jobmatch.workspaceProfile';

export type WorkspaceProfileSnapshot = {
  userId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
};

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeTrim = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

const computeFullName = (snapshot?: WorkspaceProfileSnapshot | null): string => {
  if (!snapshot) {
    return '';
  }

  const first = safeTrim(snapshot.firstName);
  const last = safeTrim(snapshot.lastName);
  const combined = `${first} ${last}`.trim();

  if (combined) {
    return combined;
  }

  const username = safeTrim(snapshot.username);
  if (username) {
    return username;
  }

  const email = safeTrim(snapshot.email);
  if (email) {
    return email;
  }

  return '';
};

const computeInitials = (name: string): string => {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || ''
  );
};

export function persistWorkspaceProfile(snapshot: WorkspaceProfileSnapshot): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      WORKSPACE_PROFILE_STORAGE_KEY,
      JSON.stringify({
        ...snapshot,
        userId: typeof snapshot.userId === 'number' ? snapshot.userId : snapshot.userId ?? null,
      })
    );
  } catch (error) {
    console.warn('Unable to persist workspace profile snapshot', error);
  }
}

export function loadWorkspaceProfile(): WorkspaceProfileSnapshot | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(WORKSPACE_PROFILE_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as WorkspaceProfileSnapshot;
  } catch (error) {
    console.warn('Unable to load workspace profile snapshot', error);
    return null;
  }
}

export function clearWorkspaceProfile(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(WORKSPACE_PROFILE_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to clear workspace profile snapshot', error);
  }
}

export function buildWorkspaceIdentity<T extends { name: string; initials: string; email?: string }>(
  fallback: T,
  snapshot?: WorkspaceProfileSnapshot | null
): T {
  if (!snapshot) {
    return fallback;
  }

  const name = computeFullName(snapshot) || fallback.name;
  const initials = computeInitials(name) || fallback.initials;
  const email = safeTrim(snapshot.email) || fallback.email;

  return {
    ...fallback,
    name,
    initials,
    email,
  };
}

export function getWorkspaceFirstName(snapshot?: WorkspaceProfileSnapshot | null, fallback?: string): string {
  return safeTrim(snapshot?.firstName) || fallback || '';
}

export function getWorkspaceUserId(snapshot?: WorkspaceProfileSnapshot | null): number | null {
  if (!snapshot) {
    return null;
  }
  if (typeof snapshot.userId === 'number' && Number.isFinite(snapshot.userId)) {
    return snapshot.userId;
  }
  return null;
}
