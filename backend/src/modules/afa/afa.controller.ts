import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { createAFARecord, listAFARecordsForVendor } from './afa.service.js';

export const createAFA = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const afa = await createAFARecord({ ...req.body, vendor: req.user._id });
  res.status(httpStatus.CREATED).json({ success: true, data: afa });
};

export const listVendorAFA = async (req: Request, res: Response) => {
  const records = await listAFARecordsForVendor(req.params.vendorId);
  res.json({ success: true, data: records });
};
