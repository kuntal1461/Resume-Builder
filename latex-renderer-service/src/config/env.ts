import 'dotenv/config';

const coercePort = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: coercePort(process.env.PORT, 4100),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
};
