import { useEffect, useState } from 'react';
import {
  ADMIN_PROFILE_STORAGE_KEY,
  resolveSidebarProfile,
  type SidebarProfile,
} from './sidebarProfile';

export type AdminProfileApiResponse = {
  id: number;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isAdmin?: boolean | null;
};

export function useSidebarProfile(defaultProfile: SidebarProfile): SidebarProfile {
  const [profile, setProfile] = useState<SidebarProfile>(defaultProfile);

  useEffect(() => {
    setProfile(resolveSidebarProfile(defaultProfile));
  }, [defaultProfile]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
      try {
        const response = await fetch(`${basePath}/api/admins/current`);
        if (!response.ok) {
          throw new Error(`Unable to load admin profile (status ${response.status}).`);
        }
        const data = (await response.json()) as AdminProfileApiResponse;

        if (typeof window !== 'undefined') {
          const storagePayload = {
            userId: data.id,
            email: data.email,
            username: data.username ?? null,
            firstName: data.firstName ?? null,
            lastName: data.lastName ?? null,
            isAdmin: data.isAdmin ?? true,
          };
          window.localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(storagePayload));
        }

        if (isMounted) {
          setProfile(
            resolveSidebarProfile({
              ...defaultProfile,
              email: data.email || defaultProfile.email,
            }),
          );
        }
      } catch (error) {
        console.error('Failed to load admin sidebar profile', error);
      }
    };

    if (typeof window !== 'undefined') {
      void loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [defaultProfile]);

  return profile;
}
