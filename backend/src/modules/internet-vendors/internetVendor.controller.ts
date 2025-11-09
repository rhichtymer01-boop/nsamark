import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { configureInternetVendor, listInternetVendors, simulateSmsDispatch } from './internetVendor.service.js';

export const getInternetVendors = async (_req: Request, res: Response) => {
  const vendors = await listInternetVendors();
  res.json({ success: true, data: vendors });
};

export const updateInternetVendorNetworks = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const vendor = await configureInternetVendor(req.user._id, req.body.supportedNetworks);
  res.json({ success: true, data: vendor });
};

export const sendBulkSms = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const result = await simulateSmsDispatch(req.user._id, req.body.recipients, req.body.message);
  res.json({ success: true, data: result });
};
