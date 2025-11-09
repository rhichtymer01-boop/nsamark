import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { createVendor, getVendorById, getVendorDashboardMetrics, listVendors, updateVendor } from './vendor.service.js';

export const createVendorProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const vendor = await createVendor({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).json({ success: true, data: vendor });
};

export const getVendors = async (req: Request, res: Response) => {
  const vendors = await listVendors(req.query);
  res.json({ success: true, data: vendors });
};

export const getVendor = async (req: Request, res: Response) => {
  const vendor = await getVendorById(req.params.id);
  if (!vendor) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Vendor not found' });
  }

  res.json({ success: true, data: vendor });
};

export const updateVendorProfile = async (req: Request, res: Response) => {
  const vendor = await updateVendor(req.params.id, req.body);
  if (!vendor) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Vendor not found' });
  }

  res.json({ success: true, data: vendor });
};

export const getVendorDashboard = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const metrics = await getVendorDashboardMetrics(req.params.id);
  if (!metrics) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Vendor not found' });
  }

  res.json({ success: true, data: metrics });
};
