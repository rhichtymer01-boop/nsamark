import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { OrderStatus } from './order.model.js';
import { assignTransporter, createOrder, listOrdersForTransporter, listOrdersForVendor, updateOrderStatus } from './order.service.js';

export const placeOrder = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const order = await createOrder({ ...req.body, customer: req.user._id });
  res.status(httpStatus.CREATED).json({ success: true, data: order });
};

export const getVendorOrders = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const orders = await listOrdersForVendor(req.params.vendorId);
  res.json({ success: true, data: orders });
};

export const getTransporterOrders = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const orders = await listOrdersForTransporter(req.params.transporterId);
  res.json({ success: true, data: orders });
};

export const updateOrder = async (req: Request, res: Response) => {
  const order = await updateOrderStatus(req.params.orderId, req.body.status as OrderStatus);
  if (!order) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
};

export const assignOrderTransporter = async (req: Request, res: Response) => {
  const order = await assignTransporter(req.params.orderId, req.body.transporterId);
  if (!order) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
};
