import mongoose from 'mongoose';

import { VendorModel } from '../vendors/vendor.model.js';
import { KYCDocument, KYCModel } from './kyc.model.js';

export interface SubmitKYCPayload {
  vendor: string;
  name: string;
  phone: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  documents?: KYCDocument['documents'];
}

export const submitKYC = async (payload: SubmitKYCPayload) => {
  const kyc = await KYCModel.findOneAndUpdate(
    { vendor: payload.vendor },
    {
      ...payload,
      vendor: new mongoose.Types.ObjectId(payload.vendor),
      documents: payload.documents ?? [],
      status: 'pending',
      reviewerNote: undefined,
      reviewedAt: undefined,
      reviewedBy: undefined
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await VendorModel.findByIdAndUpdate(payload.vendor, { kycStatus: 'pending' });
  return kyc;
};

export const getVendorKYC = (vendorId: string) => KYCModel.findOne({ vendor: vendorId }).lean();

export const listKYCRequests = () =>
  KYCModel.find()
    .populate('vendor', 'storeName category user')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();

export const getKYCById = (kycId: string) =>
  KYCModel.findById(kycId)
    .populate('vendor', 'storeName category user')
    .populate('reviewedBy', 'name email')
    .lean();

export const updateKYCStatus = async (
  kycId: string,
  status: 'approved' | 'rejected',
  reviewer: { userId: string; note?: string }
) => {
  const kyc = await KYCModel.findByIdAndUpdate(
    kycId,
    {
      status,
      reviewerNote: reviewer.note,
      reviewedAt: new Date(),
      reviewedBy: new mongoose.Types.ObjectId(reviewer.userId)
    },
    { new: true }
  );

  if (kyc) {
    await VendorModel.findByIdAndUpdate(kyc.vendor, {
      kycStatus: status === 'approved' ? 'approved' : 'rejected'
    });
  }

  return kyc;
};
