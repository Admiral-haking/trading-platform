import mongoose from 'mongoose';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongoose || { conn: null, promise: null };
if (!global.__mongoose) global.__mongoose = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = env.mongoUri;
    cached.promise = mongoose.connect(uri, {
      maxPoolSize: 10
    }).then((m) => {
      logger.info('MongoDB connected');
      return m;
    }).catch((err) => {
      logger.error('MongoDB connection error:', err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

