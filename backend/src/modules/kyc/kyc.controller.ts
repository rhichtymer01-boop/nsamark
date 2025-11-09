import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { VendorModel } from '../vendors/vendor.model.js';
import {
  getKYCById,
  getVendorKYC,
  listKYCRequests,
  submitKYC,
  updateKYCStatus
} from './kyc.service.js';

export const submitKYCRequest = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const vendor = await VendorModel.findOne({ user: req.user._id });
  if (!vendor) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Vendor profile not found' });
  }

  const files = (req.files as Express.Multer.File[]) ?? [];
  const documents = files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `/uploads/kyc/${file.filename}`,
    uploadedAt: new Date()
  }));

  const kyc = await submitKYC({
    vendor: vendor._id.toString(),
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    ghanaCardNumber: req.body.ghanaCardNumber,
    occupation: req.body.occupation,
    documents
  });

  res.status(httpStatus.CREATED).json({ success: true, data: kyc });
};

export const getMyKYC = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const vendor = await VendorModel.findOne({ user: req.user._id });
  if (!vendor) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'Vendor profile not found' });
  }

  const kyc = await getVendorKYC(vendor._id.toString());
  res.json({ success: true, data: kyc });
};

export const getKYCRequests = async (_req: Request, res: Response) => {
  const kycs = await listKYCRequests();
  res.json({ success: true, data: kycs });
};

export const getKYCRequestById = async (req: Request, res: Response) => {
  const kyc = await getKYCById(req.params.kycId);
  if (!kyc) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'KYC record not found' });
  }

  res.json({ success: true, data: kyc });
};

export const updateKYCRequestStatus = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const kyc = await updateKYCStatus(req.params.kycId, req.body.status, {
    userId: req.user._id,
    note: req.body.note
  });

  if (!kyc) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'KYC record not found' });
  }

  res.json({ success: true, data: kyc });
};
