import webPush from 'web-push';
import { Types } from 'mongoose';
import { PushSubscriptions, type PushSubscriptionAttrs } from '../../models/PushSubscription';
import { env } from '../../utils/env';
import { logger } from '../../utils/logger';
import type { EventPayload } from '../../ws';

const ICON_PATH = '/icons/icon-192x192.png';
const BADGE_PATH = '/icons/icon-192x192.png';

type LeanSubscription = PushSubscriptionAttrs & { _id: Types.ObjectId };

const publicKey = env.webPushPublicKey.trim();
const privateKey = env.webPushPrivateKey.trim();
const vapidSubject = env.webPushSubject || 'mailto:admin@example.com';

const isConfigured = Boolean(publicKey && privateKey);

if (isConfigured) {
  webPush.setVapidDetails(vapidSubject, publicKey, privateKey);
} else {
  logger.warn('Web push notifications are disabled: missing WEB_PUSH_PUBLIC_KEY or WEB_PUSH_PRIVATE_KEY');
}

type NotificationPayload = {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
  icon?: string;
  badge?: string;
};

function formatNotification(event: EventPayload): NotificationPayload | null {
  const { type, payload = {} } = event as EventPayload & { payload?: Record<string, any> };
  const market = payload?.market ? String(payload.market) : undefined;
  const entry = payload?.entry != null ? String(payload.entry) : undefined;
  const messageId = payload?.messageId != null ? String(payload.messageId) : undefined;
  const state = payload?.state != null ? String(payload.state) : undefined;

  const base: NotificationPayload = {
    title: 'Trading Update',
    body: 'New activity on your trading signals.',
    data: { url: '/signals', type, messageId },
    icon: ICON_PATH,
    badge: BADGE_PATH,
  };

  switch (type) {
    case 'signal:new':
      const details = [market, payload?.position, entry ? `@ ${entry}` : null].filter(Boolean).join(' ');
      return {
        ...base,
        title: 'New Signal',
        body: details || 'A new signal is available.',
        tag: payload?._id ? `signal-${payload._id}` : undefined,
      };
    case 'signal:update':
      return {
        ...base,
        title: 'Signal Updated',
        body: market ? `${market} updated${state ? ` (${state})` : ''}.` : 'A trading signal was updated.',
        tag: payload?._id ? `signal-${payload._id}` : undefined,
      };
    case 'signal:state':
      return {
        ...base,
        title: 'Signal Status',
        body: market && state ? `${market} is now ${state}.` : 'A trading signal state has changed.',
        tag: payload?._id ? `signal-${payload._id}` : undefined,
      };
    case 'signal:delete':
      return {
        ...base,
        title: 'Signal Removed',
        body: messageId ? `Signal ${messageId} has been removed.` : 'A signal has been removed.',
        tag: messageId ? `signal-${messageId}` : undefined,
      };
    case 'signal:exit':
      return {
        ...base,
        title: 'Signal Exited',
        body: messageId ? `Signal ${messageId} has exited.` : 'A signal has exited.',
        tag: messageId ? `signal-${messageId}` : undefined,
      };
    case 'signal:error':
      return {
        ...base,
        title: 'Signal Error',
        body: `${market ?? 'Signal'}: ${payload?.message ?? 'Unknown error'}`,
        tag: payload?._id ? `signal-${payload._id}` : undefined,
      };
    case 'order:filled':
      return {
        ...base,
        title: 'Order Filled',
        body: `${market ?? 'Order'} filled successfully.`,
        tag: payload?.orderId ? `order-${payload.orderId}` : undefined,
      };
    case 'position:closed':
      return {
        ...base,
        title: 'Position Closed',
        body: `${market ?? 'Position'} closed with PnL ${payload?.realized_pnl ?? ''}`.trim(),
        tag: payload?.positionId ? `position-${payload.positionId}` : undefined,
      };
    case 'position:sl_moved':
      return {
        ...base,
        title: 'Stop Loss Moved',
        body: `${market ?? 'Position'} stop loss moved to ${payload?.to ?? ''}`.trim(),
        tag: payload?.positionId ? `position-${payload.positionId}` : undefined,
      };
    default:
      return {
        ...base,
        body: `${market ?? 'Trading activity'} updated (${type}).`,
      };
  }
}

async function deliverToSubscriptions(subscriptions: LeanSubscription[], payload: string) {
  const results = await Promise.all(subscriptions.map(async (subscription) => {
    if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
      await PushSubscriptions.deleteOne({ _id: subscription._id });
      return false;
    }
    try {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        payload
      );
      return true;
    } catch (error: any) {
      const status = error?.statusCode;
      if (status === 404 || status === 410) {
        await PushSubscriptions.deleteOne({ _id: subscription._id });
      }
      logger.warn('Failed to send push notification', {
        endpoint: subscription.endpoint,
        status,
        error: error?.message ?? error,
      });
      return false;
    }
  }));

  return results.filter(Boolean).length;
}

async function sendPush(event: EventPayload) {
  if (!isConfigured) return;

  const notification = formatNotification(event);
  if (!notification) return;

  const payload = JSON.stringify(notification);

  const subscriptions = await PushSubscriptions.find();
  if (!subscriptions.length) return;

  await deliverToSubscriptions(subscriptions, payload);
}

export function enqueuePushNotification(event: EventPayload) {
  if (!isConfigured) return;
  void sendPush(event).catch((error) => {
    logger.error('Unexpected push notification error', { error });
  });
}

export async function sendTestNotification(userId: Types.ObjectId) {
  if (!isConfigured) {
    throw new Error('Web push notifications are not configured.');
  }

  const subscriptions = await PushSubscriptions.find({ user: userId });
  if (!subscriptions.length) {
    return { delivered: 0, total: 0 };
  }

  const payload = JSON.stringify({
    title: 'Notifications Enabled',
    body: 'Push notifications are working on this device.',
    icon: ICON_PATH,
    badge: BADGE_PATH,
    data: { url: '/signals', type: 'notification:test' },
    tag: 'notification-test',
  });

  const delivered = await deliverToSubscriptions(subscriptions, payload);
  return { delivered, total: subscriptions.length };
}
