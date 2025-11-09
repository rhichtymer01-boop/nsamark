import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import {
  assignOrderTransporter,
  getTransporterOrders,
  getVendorOrders,
  placeOrder,
  updateOrder
} from './order.controller.js';

export const orderRouter = Router();

orderRouter.post('/', authenticate, placeOrder);
orderRouter.get('/vendors/:vendorId', authenticate, getVendorOrders);
orderRouter.get('/transporters/:transporterId', authenticate, getTransporterOrders);
orderRouter.patch('/:orderId', authenticate, updateOrder);
orderRouter.post('/:orderId/assign-transporter', authenticate, assignOrderTransporter);
