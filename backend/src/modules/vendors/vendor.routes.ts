import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import {
  createVendorProfile,
  getVendor,
  getVendorDashboard,
  getVendors,
  updateVendorProfile
} from './vendor.controller.js';

export const vendorRouter = Router();

vendorRouter.get('/', getVendors);
vendorRouter.get('/:id', getVendor);
vendorRouter.get('/:id/dashboard', authenticate, getVendorDashboard);
vendorRouter.post('/', authenticate, createVendorProfile);
vendorRouter.put('/:id', authenticate, updateVendorProfile);
