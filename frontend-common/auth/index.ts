export type StoredAdminProfile = {
  userId?: number | null;
  email?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isAdmin?: boolean | null;
};

export const ADMIN_PROFILE_STORAGE_KEY = 'jobmatch.adminProfile';
