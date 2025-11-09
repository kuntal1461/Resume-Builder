export type CanonicalEnvName = 'local' | 'staging' | 'production';

export type ServerEnvironmentInfo = {
  envName: CanonicalEnvName;
  isProd: boolean;
  isLocal: boolean;
  isStaging: boolean;
  apiBaseUrl: string;
};

const DEFAULT_LOCAL_API = 'http://localhost:8000';
const envFromProcess =
  (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined | null> };
    }
  ).process?.env ?? {};

const ENV_ALIAS_MAP: Record<CanonicalEnvName, string[]> = {
  local: ['local', 'localhost', 'dev', 'development'],
  staging: ['stage', 'staging', 'qa', 'test'],
  production: ['prod', 'production', 'live'],
};

const DEFAULT_ENV: CanonicalEnvName = 'local';

function normalizeEnvName(raw?: string | null): CanonicalEnvName {
  const candidate = (raw ?? '').trim().toLowerCase();
  if (!candidate) {
    return DEFAULT_ENV;
  }

  for (const [canonical, aliases] of Object.entries(ENV_ALIAS_MAP)) {
    if (candidate === canonical || aliases.includes(candidate)) {
      return canonical as CanonicalEnvName;
    }
  }

  throw new Error(
    `Unsupported SERVER_ENV '${raw}'. Expected one of: ${Object.keys(ENV_ALIAS_MAP).join(', ')}`
  );
}

function resolveApiBaseUrl(envName: CanonicalEnvName): string {
  const explicitServer = envFromProcess.API_BASE_URL?.trim();
  const explicitPublic = envFromProcess.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (explicitServer) {
    return explicitServer;
  }

  if (explicitPublic) {
    return explicitPublic;
  }

  if (envName === 'local') {
    return DEFAULT_LOCAL_API;
  }

  throw new Error(
    'API_BASE_URL is not configured. Set API_BASE_URL (or NEXT_PUBLIC_API_BASE_URL) for the frontend.'
  );
}

export function resolveServerEnvironment(
  overrides?: Partial<{ apiBaseUrl: string; serverEnv: string }>
): ServerEnvironmentInfo {
  const envName = normalizeEnvName(
    overrides?.serverEnv ??
      envFromProcess.SERVER_ENV ??
      envFromProcess.NEXT_PUBLIC_SERVER_ENV ??
      envFromProcess.NODE_ENV
  );
  const apiBaseUrl = overrides?.apiBaseUrl ?? resolveApiBaseUrl(envName);

  return {
    envName,
    isProd: envName === 'production',
    isLocal: envName === 'local',
    isStaging: envName === 'staging',
    apiBaseUrl,
  };
}
