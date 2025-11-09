import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { createSubscription, listSubscriptions, updateSubscription } from './subscription.service.js';

export const getSubscriptions = async (_req: Request, res: Response) => {
  const subscriptions = await listSubscriptions();
  res.json({ success: true, data: subscriptions });
};

export const createSubscriptionPlan = async (req: Request, res: Response) => {
  const subscription = await createSubscription(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: subscription });
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  const subscription = await updateSubscription(req.params.id, req.body);
  if (!subscription) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Subscription not found' });
  }

  res.json({ success: true, data: subscription });
};
