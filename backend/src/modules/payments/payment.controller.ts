import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { initializePaystackTransaction } from './payment.service.js';

export const initiatePayment = async (req: AuthenticatedRequest, res: Response) => {
  const { amount } = req.body;

  const customerEmail = req.user?.email ?? req.body.email;
  if (!customerEmail) {
    return res.status(400).json({ success: false, message: 'Customer email required' });
  }

  const transaction = await initializePaystackTransaction({
    email: customerEmail,
    amount,
    reference: randomUUID()
  });

  res.json({ success: true, data: transaction });
};

export const paystackWebhook = async (req: Request, res: Response) => {
  // Placeholder: validate Paystack signature and update wallet/orders accordingly.
  res.json({ success: true });
};
