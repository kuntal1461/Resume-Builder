import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { NextFunction, Request, Response } from 'express';
import { env } from './config/env';
import { logger } from './infra/logger';
import { renderRouter } from './modules/render/render.router';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins.length > 0 ? env.allowedOrigins : true,
      optionsSuccessStatus: 200,
    }),
  );
  app.use(express.json({ limit: '2mb' }));

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/render', renderRouter);

  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    logger.error({ err }, 'Unhandled error in request pipeline');
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};
