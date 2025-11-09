import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_PORT: z.string().transform((val) => Number(val)).default('4000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().min(8),
  PAYSTACK_PUBLIC_KEY: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),
  PAYSTACK_CALLBACK_URL: z.string().url().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  OPENSTREETMAP_API_KEY: z.string().optional(),
  AFA_FORM_NOTIFICATION_EMAIL: z.string().email().optional(),
  CORS_ORIGINS: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

const config = parsed.data;

export const env = {
  nodeEnv: config.NODE_ENV,
  port: config.APP_PORT,
  mongoUri: config.MONGODB_URI,
  jwtSecret: config.JWT_SECRET,
  paystack: {
    publicKey: config.PAYSTACK_PUBLIC_KEY,
    secretKey: config.PAYSTACK_SECRET_KEY,
    callbackUrl: config.PAYSTACK_CALLBACK_URL ?? ''
  },
  googleMapsApiKey: config.GOOGLE_MAPS_API_KEY,
  openStreetMapApiKey: config.OPENSTREETMAP_API_KEY,
  afaNotificationEmail: config.AFA_FORM_NOTIFICATION_EMAIL,
  corsOrigins: config.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? ['http://localhost:3000']
};
