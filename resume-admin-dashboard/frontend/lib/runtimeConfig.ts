export type EnvironmentConfig = {
  envName: string;
  isProd: boolean;
  isLocal: boolean;
  isStaging: boolean;
  apiBaseUrl: string;
  renderServiceBaseUrl: string;
};

let cachedConfig: EnvironmentConfig | null = null;

export async function getEnvironmentConfig(): Promise<EnvironmentConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const response = await fetch(`${basePath}/api/env-config`);
  if (!response.ok) {
    throw new Error(`Failed to load environment config (status ${response.status})`);
  }

  const data: EnvironmentConfig = await response.json();
  cachedConfig = data;
  return data;
}
