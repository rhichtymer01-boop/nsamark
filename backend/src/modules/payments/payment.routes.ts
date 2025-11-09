import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import { initiatePayment, paystackWebhook } from './payment.controller.js';

export const paymentRouter = Router();

paymentRouter.post('/initialize', authenticate, initiatePayment);
paymentRouter.post('/paystack/webhook', paystackWebhook);
