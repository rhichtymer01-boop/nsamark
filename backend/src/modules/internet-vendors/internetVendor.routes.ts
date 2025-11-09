import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import {
  getInternetVendors,
  sendBulkSms,
  updateInternetVendorNetworks
} from './internetVendor.controller.js';

export const internetVendorRouter = Router();

internetVendorRouter.get('/', authenticate, getInternetVendors);
internetVendorRouter.put('/networks', authenticate, updateInternetVendorNetworks);
internetVendorRouter.post('/sms', authenticate, sendBulkSms);
