export type NetworkErrorDescription = {
  message: string;
  isNetworkError: boolean;
};

const NETWORK_ERROR_PATTERNS = [
  'failed to fetch',
  'fetch failed',
  'network request failed',
  'networkerror when attempting to fetch resource',
  'load failed',
  'network connection lost',
];

const isLikelyNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const name = 'name' in error ? String((error as { name?: unknown }).name ?? '') : '';
  const message = 'message' in error ? String((error as { message?: unknown }).message ?? '') : '';
  const loweredName = name.trim().toLowerCase();
  const loweredMessage = message.trim().toLowerCase();

  if (loweredName === 'typeerror') {
    return NETWORK_ERROR_PATTERNS.some((pattern) => loweredMessage.includes(pattern));
  }

  if (loweredName === 'domexception' && loweredMessage.includes('aborted')) {
    return true;
  }

  return false;
};

type DescribeNetworkErrorOptions = {
  apiBaseUrl?: string;
  networkMessage?: string;
};

export function describeNetworkError(
  error: unknown,
  fallbackMessage: string,
  options: DescribeNetworkErrorOptions = {}
): NetworkErrorDescription {
  const { apiBaseUrl, networkMessage } = options;

  if (isLikelyNetworkError(error)) {
    const defaultMessage = apiBaseUrl
      ? `Unable to reach the API at ${apiBaseUrl}. Please ensure the backend is running.`
      : 'Unable to reach the API. Please ensure the backend is running.';

    return {
      isNetworkError: true,
      message: networkMessage ?? defaultMessage,
    };
  }

  if (error instanceof Error && error.message) {
    return {
      isNetworkError: false,
      message: error.message,
    };
  }

  return {
    isNetworkError: false,
    message: fallbackMessage,
  };
}
