import express, { Request, Response } from 'express';
import next from 'next';
import path from 'path';

import apiRouter from './api';
import { connectToDatabase } from './models';
import { Trader } from './modules/trader';
import { logger } from './utils/logger';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '4040', 10);

// Always resolve the Next app dir from project root
const nextDir = path.resolve(process.cwd(), 'next');

async function main() {
  const nextApp = next({ dev, dir: nextDir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const app = express();

  // JSON body parsing for API routes
  app.use(express.json());

  // Mount API under /api
  app.use('/api', apiRouter);

  // All other requests handled by Next.js
  app.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  // Ensure DB is connected before accepting requests
  await connectToDatabase();

  app.listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    logger.info(`Server listening on http://localhost:${port} (dev=${dev})`);
    Trader.start()
  });
}


main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
