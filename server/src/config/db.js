import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  let uri = env.mongoUri;

  if (uri.startsWith('memory://')) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('queen_terry');
    globalThis.__QT_MEMORY_DB__ = memoryServer;
    console.log('[db] Using in-memory MongoDB (development only)');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: !env.isProduction });
  console.log(`[db] Connected to MongoDB: ${mongoose.connection.name}`);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (globalThis.__QT_MEMORY_DB__) {
    await globalThis.__QT_MEMORY_DB__.stop();
  }
}
