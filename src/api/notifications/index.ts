import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { PushSubscriptions } from '../../models/PushSubscription';
import { logger } from '../../utils/logger';
import { sendTestNotification } from '../../modules/push/notifier';

const notificationsRouter = Router();

notificationsRouter.post('/notifications/subscribe', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const subscription = req.body?.subscription;
    if (!subscription || typeof subscription !== 'object') {
      return res.status(400).json({ message: 'Invalid subscription payload' });
    }

    const { endpoint, keys } = subscription;
    if (typeof endpoint !== 'string') {
      return res.status(400).json({ message: 'Subscription endpoint is required' });
    }

    if (!keys || typeof keys !== 'object' || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') {
      return res.status(400).json({ message: 'Missing subscription fields' });
    }

    await PushSubscriptions.findOneAndUpdate(
      { endpoint },
      {
        user: req.user._id,
        endpoint,
        keys,
        userAgent: req.headers['user-agent'] ?? undefined,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    logger.error('Failed to persist push subscription', { error });
    next(error);
  }
});

notificationsRouter.post('/notifications/test', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await sendTestNotification(req.user._id);

    if (result.total === 0) {
      return res.status(200).json({ ok: true, delivered: 0, total: 0, message: 'No push subscriptions registered yet.' });
    }

    return res.status(200).json({ ok: true, delivered: result.delivered, total: result.total });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send test notification.';
    logger.error('Failed to send test notification', { error });

    if (message.includes('not configured')) {
      return res.status(503).json({ message });
    }

    return res.status(500).json({ message });
  }
});

export { notificationsRouter };
