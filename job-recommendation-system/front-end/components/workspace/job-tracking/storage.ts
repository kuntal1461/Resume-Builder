import type { LikedJobSnapshot } from './types';

export const LIKED_JOBS_STORAGE_KEY = 'jobTrackerLikedJobs';

const readStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(LIKED_JOBS_STORAGE_KEY);
};

const writeStorage = (payload: LikedJobSnapshot[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!payload.length) {
    window.localStorage.removeItem(LIKED_JOBS_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(LIKED_JOBS_STORAGE_KEY, JSON.stringify(payload));
};

export const loadLikedJobSnapshots = (): LikedJobSnapshot[] => {
  const raw = readStorage();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as LikedJobSnapshot[];
  } catch {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LIKED_JOBS_STORAGE_KEY);
    }
    return [];
  }
};

export const upsertLikedJobSnapshot = (snapshot: LikedJobSnapshot) => {
  const existing = loadLikedJobSnapshots().filter((job) => job.id !== snapshot.id);
  writeStorage([...existing, snapshot]);
};

export const removeLikedJobSnapshot = (jobId: string) => {
  const existing = loadLikedJobSnapshots().filter((job) => job.id !== jobId);
  writeStorage(existing);
};
