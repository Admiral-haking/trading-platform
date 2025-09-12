import { Router, Request, Response } from 'express';
import { authRouter } from './auth';
import { telegramRouter } from './telegram';
import { coinexRouter } from './coinex';
import { incomeRouter } from './income';
import { FollowersRouter } from './followers';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

router.use(authRouter)
router.use(telegramRouter)
router.use(coinexRouter)
router.use(incomeRouter)
router.use(FollowersRouter)
export default router;

