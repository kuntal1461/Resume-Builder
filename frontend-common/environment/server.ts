export type CanonicalEnvName = 'local' | 'staging' | 'production';

export type ServerEnvironmentInfo = {
  envName: CanonicalEnvName;
  isProd: boolean;
  isLocal: boolean;
  isStaging: boolean;
  apiBaseUrl: string;
  renderServiceBaseUrl: string;
};

const DEFAULT_LOCAL_API = 'http://localhost:8000';
const DEFAULT_LOCAL_RENDER_SERVICE = 'http://localhost:4100';
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

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

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
    return stripTrailingSlash(explicitServer);
  }

  if (explicitPublic) {
    return stripTrailingSlash(explicitPublic);
  }

  if (envName === 'local') {
    return DEFAULT_LOCAL_API;
  }

  throw new Error(
    'API_BASE_URL is not configured. Set API_BASE_URL (or NEXT_PUBLIC_API_BASE_URL) for the frontend.'
  );
}

function resolveRenderServiceBaseUrl(envName: CanonicalEnvName): string {
  const explicitServer = envFromProcess.RENDER_SERVICE_BASE_URL?.trim();
  const explicitPublic = envFromProcess.NEXT_PUBLIC_RENDER_SERVICE_URL?.trim();

  if (explicitServer) {
    return stripTrailingSlash(explicitServer);
  }

  if (explicitPublic) {
    return stripTrailingSlash(explicitPublic);
  }

  if (envName === 'local') {
    return DEFAULT_LOCAL_RENDER_SERVICE;
  }

  throw new Error(
    'RENDER_SERVICE_BASE_URL is not configured. Set RENDER_SERVICE_BASE_URL (or NEXT_PUBLIC_RENDER_SERVICE_URL) for the frontend.'
  );
}

export function resolveServerEnvironment(
  overrides?: Partial<{ apiBaseUrl: string; serverEnv: string; renderServiceBaseUrl: string }>
): ServerEnvironmentInfo {
  const envName = normalizeEnvName(
    overrides?.serverEnv ??
      envFromProcess.SERVER_ENV ??
      envFromProcess.NEXT_PUBLIC_SERVER_ENV ??
      envFromProcess.NODE_ENV
  );
  const apiBaseUrl = overrides?.apiBaseUrl ?? resolveApiBaseUrl(envName);
  const renderServiceBaseUrl = overrides?.renderServiceBaseUrl ?? resolveRenderServiceBaseUrl(envName);

  return {
    envName,
    isProd: envName === 'production',
    isLocal: envName === 'local',
    isStaging: envName === 'staging',
    apiBaseUrl,
    renderServiceBaseUrl,
  };
}
