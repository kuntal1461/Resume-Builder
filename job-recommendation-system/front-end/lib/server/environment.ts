type ServerEnvironmentInfo = {
  envName: string;
  isProd: boolean;
  isLocal: boolean;
  apiBaseUrl: string;
};

const KNOWN_ENVIRONMENTS = [
  
  'LOCALHOST',
  'DEV',
  'QA',
  'STAGING',
  'PROD',
  
] as const;

const DEFAULT_LOCAL_API = 'http://localhost:8000';

export function resolveServerEnvironment(): ServerEnvironmentInfo {
  const baseUrlFromEnv = process.env.API_BASE_URL?.trim() ?? '';
  const lowerBaseUrl = baseUrlFromEnv.toLowerCase();

  let envName: string | undefined;
  for (const candidate of KNOWN_ENVIRONMENTS) {
    if (lowerBaseUrl.includes(candidate.toLowerCase())) {
      envName = candidate;
      break;
    }
  }

  const isLocal =
    process.env.IS_LOCAL === 'true' ||
    lowerBaseUrl.includes('localhost') ||
    process.env.NODE_ENV === 'development';

  const apiBaseUrl =
    baseUrlFromEnv ||
    (isLocal ? DEFAULT_LOCAL_API : '');

  if (!apiBaseUrl) {
    throw new Error(
      'API_BASE_URL is not configured. Set API_BASE_URL (or enable IS_LOCAL) so the frontend can reach the backend.'
    );
  }

  const isProd = !isLocal && (!envName || envName === 'PROD') && process.env.NODE_ENV === 'production';

  return {
    envName: envName ?? (isProd ? 'PROD' : 'UNKNOWN'),
    isProd,
    isLocal,
    apiBaseUrl,
  };
}
