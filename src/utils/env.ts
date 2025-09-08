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
  port: fromEnv('PORT', asInt, 3000),
  mongoUri: fromEnv('MONGODB_URI', asString, 'mongodb://localhost:27017/trading-platform')
};

