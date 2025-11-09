import { Request, Response } from 'express';

import { listKYCRequests, updateKYCStatus } from '../kyc/kyc.service.js';
import { listSubscriptions } from '../subscriptions/subscription.service.js';
import { listVendors } from '../vendors/vendor.service.js';

export const getAdminDashboard = async (_req: Request, res: Response) => {
  const [vendors, subscriptions, kycRequests] = await Promise.all([
    listVendors(),
    listSubscriptions(),
    listKYCRequests()
  ]);

  res.json({
    success: true,
    data: {
      vendorCount: vendors.length,
      subscriptions,
      pendingKYC: kycRequests.filter((kyc) => kyc.status === 'pending').length
    }
  });
};

export const approveKYC = async (req: Request, res: Response) => {
  const kyc = await updateKYCStatus(req.params.kycId, 'approved');
  res.json({ success: true, data: kyc });
};

export const rejectKYC = async (req: Request, res: Response) => {
  const kyc = await updateKYCStatus(req.params.kycId, 'rejected');
  res.json({ success: true, data: kyc });
};
