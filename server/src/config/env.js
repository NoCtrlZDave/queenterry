import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

const jwtSecret =
  process.env.JWT_SECRET ||
  (nodeEnv === 'production'
    ? ''
    : 'queen-terry-development-secret-change-before-deploying');

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required in production.');
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/queen_terry',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  admin: {
    name: process.env.ADMIN_NAME || 'Queen Terry Admin',
    email: (process.env.ADMIN_EMAIL || 'admin@queenterry.test').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    phone: process.env.ADMIN_PHONE || '09025068558',
  },
  whatsappNumber: (process.env.WHATSAPP_NUMBER || '2349025068558').replace(/\D/g, ''),
  seedDemo: process.env.SEED_DEMO !== 'false',
};
