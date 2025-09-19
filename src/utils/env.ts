type Parse<T> = (raw: string) => T;

const asString: Parse<string> = (v) => v;
const asInt: Parse<number> = (v) => {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) throw new Error(`Invalid int for env: ${v}`);
  return n;
};

export function fromEnv<T>(key: string, parse: Parse<T>, fallback?: T): T {
  const raw = process.env[key];
  if (raw == null || raw === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var ${key}`);
  }
  return parse(raw);
}

export const env = {
  nodeEnv: fromEnv('NODE_ENV', asString, 'development'),
  port: fromEnv('PORT', asInt, 4040),
  mongoUri: fromEnv('MONGODB_URI', asString, 'mongodb://localhost:27017/trading-platform'),
  name: fromEnv('NAME', asString, ''),
  webPushPublicKey: fromEnv('WEB_PUSH_PUBLIC_KEY', asString, 'BKSBAVcKgkdkdA95I4W6paxO-bBu4G5ts-1XDdjw99sz5KiypUEHY7Iib9wEN-NL5aHlnA33qOMBpgBVA64qLOA'),
  webPushPrivateKey: fromEnv('WEB_PUSH_PRIVATE_KEY', asString, 'e0uKvDlb8EiwSSFQpw0sZlcu44hn0zCeOQwZwbxNqBw'),
  webPushSubject: fromEnv('WEB_PUSH_SUBJECT', asString, 'mailto:admin@example.com'),
};
