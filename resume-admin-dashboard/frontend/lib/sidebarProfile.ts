export const ADMIN_PROFILE_STORAGE_KEY = 'jobmatch.adminProfile';

type StoredAdminProfile = {
  userId?: number | null;
  email?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isAdmin?: boolean | null;
};

export type SidebarProfile = {
  name: string;
  initials: string;
  tagline: string;
  email: string;
};

const ADMIN_TAGLINE = 'Administrator';

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

const safeTrim = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

const buildName = (stored: StoredAdminProfile, fallbackName: string): string => {
  const first = safeTrim(stored.firstName);
  const last = safeTrim(stored.lastName);
  const combined = `${first} ${last}`.trim();
  if (combined) {
    return combined;
  }

  const username = safeTrim(stored.username);
  if (username) {
    return username;
  }

  const email = safeTrim(stored.email);
  if (email) {
    return email;
  }

  return fallbackName;
};

const buildEmail = (stored: StoredAdminProfile, fallbackEmail: string): string => {
  return safeTrim(stored.email) || fallbackEmail;
};

export function resolveSidebarProfile(defaultProfile: SidebarProfile): SidebarProfile {
  if (typeof window === 'undefined') {
    return defaultProfile;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
    if (!raw) {
      return defaultProfile;
    }

    const parsed = JSON.parse(raw) as StoredAdminProfile | null;
    if (!parsed || typeof parsed !== 'object') {
      return defaultProfile;
    }

    const name = buildName(parsed, defaultProfile.name);
    const email = buildEmail(parsed, defaultProfile.email);
    const tagline = parsed.isAdmin ? ADMIN_TAGLINE : defaultProfile.tagline;
    const initials = computeInitials(name) || defaultProfile.initials;

    return {
      name,
      email,
      tagline,
      initials,
    };
  } catch (error) {
    console.warn('Failed to hydrate admin sidebar profile from storage', error);
    return defaultProfile;
  }
}
