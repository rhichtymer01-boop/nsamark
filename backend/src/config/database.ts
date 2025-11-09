import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  mongoose.connection.on('connected', () => {
    console.log('📦 Connected to MongoDB');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
};
