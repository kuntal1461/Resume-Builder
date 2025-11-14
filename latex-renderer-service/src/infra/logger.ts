import pino, { LoggerOptions, TransportSingleOptions } from 'pino';
import { env } from '../config/env';

const options: LoggerOptions = {
  name: 'latex-renderer-service',
  level: env.logLevel,
};

if (env.nodeEnv === 'development') {
  options.transport = {
    target: 'pino-pretty',
    options: { colorize: true },
  } satisfies TransportSingleOptions;
}

export const logger = pino(options);
