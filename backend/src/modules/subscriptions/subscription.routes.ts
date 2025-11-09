import { Router } from 'express';

import { authorize, authenticate } from '../../middlewares/authMiddleware.js';
import { UserRole } from '../users/user.model.js';
import {
  createSubscriptionPlan,
  getSubscriptions,
  updateSubscriptionPlan
} from './subscription.controller.js';

export const subscriptionRouter = Router();

subscriptionRouter.get('/', authenticate, getSubscriptions);
subscriptionRouter.post('/', authenticate, authorize([UserRole.ADMIN]), createSubscriptionPlan);
subscriptionRouter.put('/:id', authenticate, authorize([UserRole.ADMIN]), updateSubscriptionPlan);
