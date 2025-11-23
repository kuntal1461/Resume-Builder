export type WorkspaceProfileFallback = {
  name: string;
  tagline: string;
  initials: string;
  progressLabel: string;
};

const GUEST_BASE_PROFILE: WorkspaceProfileFallback = {
  name: 'Guest',
  tagline: 'Personalize your JobMatch workspace',
  initials: 'GU',
  progressLabel: '0%',
};

export const createGuestWorkspaceProfile = (
  overrides?: Partial<WorkspaceProfileFallback>
): WorkspaceProfileFallback => ({
  ...GUEST_BASE_PROFILE,
  ...overrides,
});
