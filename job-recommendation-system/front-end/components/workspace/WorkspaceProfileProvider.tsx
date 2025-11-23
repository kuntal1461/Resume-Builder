import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  WORKSPACE_PROFILE_STORAGE_KEY,
  buildWorkspaceIdentity,
  loadWorkspaceProfile,
  type WorkspaceProfileSnapshot,
} from '../../lib/workspaceProfileStorage';

const DEFAULT_IDENTITY = {
  name: 'Guest',
  initials: 'GU',
  email: '',
};

type WorkspaceIdentity = typeof DEFAULT_IDENTITY;

type WorkspaceProfileContextValue = {
  identity: WorkspaceIdentity;
  snapshot: WorkspaceProfileSnapshot | null;
  isLoaded: boolean;
  refresh: () => void;
};

const WorkspaceProfileContext = createContext<WorkspaceProfileContextValue | undefined>(undefined);

export function WorkspaceProfileProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<WorkspaceIdentity>(DEFAULT_IDENTITY);
  const [snapshot, setSnapshot] = useState<WorkspaceProfileSnapshot | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadIdentity = useCallback(() => {
    const loaded = loadWorkspaceProfile();
    setSnapshot(loaded);
    setIdentity(buildWorkspaceIdentity(DEFAULT_IDENTITY, loaded));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadIdentity();
  }, [loadIdentity]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== WORKSPACE_PROFILE_STORAGE_KEY) {
        return;
      }
      loadIdentity();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadIdentity]);

  const value = useMemo(
    () => ({ identity, snapshot, isLoaded, refresh: loadIdentity }),
    [identity, snapshot, isLoaded, loadIdentity]
  );

  return <WorkspaceProfileContext.Provider value={value}>{children}</WorkspaceProfileContext.Provider>;
}

export function useWorkspaceProfile(): WorkspaceProfileContextValue {
  const context = useContext(WorkspaceProfileContext);
  if (!context) {
    throw new Error('useWorkspaceProfile must be used within a WorkspaceProfileProvider');
  }
  return context;
}
