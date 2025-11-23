import { useMemo } from 'react';
import type { WorkspaceProfileFallback } from './profileFallback';
import { useWorkspaceProfile } from './WorkspaceProfileProvider';

export function useWorkspaceShellProfile(baseProfile: WorkspaceProfileFallback): WorkspaceProfileFallback {
  const { identity } = useWorkspaceProfile();

  return useMemo(
    () => ({
      ...baseProfile,
      name: identity.name,
      initials: identity.initials,
    }),
    [baseProfile, identity.name, identity.initials]
  );
}
