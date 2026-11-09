import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { Product } from './models/Product.js';
import { seedDatabase } from './utils/seed.js';
import { uploadsDir } from './middleware/upload.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('trust proxy', 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: env.isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
          },
        }
      : false,
  })
);
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.use('/uploads', express.static(uploadsDir, { maxAge: '30d' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Queen Terry', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', catalogRoutes);
app.use('/api', settingsRoutes);
app.use('/api', notFound);

const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: '1h' }));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Queen Terry API is running. Start the client with npm --prefix client run dev.',
    });
  });
}

app.use(errorHandler);

async function start() {
  try {
    await connectDB();

    if (env.seedDemo && (await Product.countDocuments()) === 0) {
      console.log('[api] Empty catalogue detected. Seeding store data...');
      await seedDatabase({ includeDemo: true });
    }

    const server = app.listen(env.port, () => {
      console.log(`[api] Queen Terry API listening on http://localhost:${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n[api] ${signal} received. Closing server...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('[api] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
