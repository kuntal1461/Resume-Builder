import {
  resolveServerEnvironment as resolveSharedServerEnvironment,
  type CanonicalEnvName,
  type ServerEnvironmentInfo,
} from "@frontend-common/environment";

const DEFAULT_ADMIN_API_BASE_URL = "http://localhost:8100";
const DEFAULT_ADMIN_RENDER_BASE_URL = "http://localhost:4100";

type ResolveOverrides = Partial<{
  apiBaseUrl: string;
  serverEnv: string;
  renderServiceBaseUrl: string;
}>;

const pick = (...candidates: Array<string | undefined>): string | undefined => {
  for (const candidate of candidates) {
    if (candidate && candidate.trim()) {
      return candidate.trim();
    }
  }
  return undefined;
};

export function resolveServerEnvironment(
  overrides?: ResolveOverrides,
): ServerEnvironmentInfo {
  const apiBaseOverride =
    pick(
      overrides?.apiBaseUrl,
      process.env.RESUME_ADMIN_API_BASE_URL,
      process.env.API_BASE_URL,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    ) ?? DEFAULT_ADMIN_API_BASE_URL;

  const renderServiceOverride =
    pick(
      overrides?.renderServiceBaseUrl,
      process.env.RESUME_ADMIN_RENDER_SERVICE_URL,
      process.env.RENDER_SERVICE_BASE_URL,
      process.env.NEXT_PUBLIC_RENDER_SERVICE_URL,
    ) ?? DEFAULT_ADMIN_RENDER_BASE_URL;

  return resolveSharedServerEnvironment({
    ...overrides,
    apiBaseUrl: apiBaseOverride,
    renderServiceBaseUrl: renderServiceOverride,
  });
}

export type { CanonicalEnvName, ServerEnvironmentInfo };
