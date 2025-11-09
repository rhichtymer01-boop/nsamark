import { FilterQuery } from 'mongoose';

import { VendorDocument, VendorModel } from './vendor.model.js';

export interface CreateVendorPayload {
  user: string;
  category: VendorDocument['category'];
  transporterType?: VendorDocument['transporterType'];
  storeName: string;
  description?: string;
  address: string;
  logoUrl?: string;
  location?: { coordinates: [number, number] };
}

export const createVendor = async (payload: CreateVendorPayload) => {
  return VendorModel.create({
    ...payload,
    location: {
      type: 'Point',
      coordinates: payload.location?.coordinates ?? [0, 0]
    }
  });
};

export const getVendorById = async (id: string) => VendorModel.findById(id).populate('user');

export const listVendors = async (filter: FilterQuery<VendorDocument> = {}) => VendorModel.find(filter).lean();

export const updateVendor = async (id: string, updates: Partial<VendorDocument>) =>
  VendorModel.findByIdAndUpdate(id, updates, { new: true });

export const getVendorDashboardMetrics = async (vendorId: string) => {
  const vendor = await VendorModel.findById(vendorId);
  if (!vendor) {
    return null;
  }

  return {
    revenue: vendor.revenue,
    walletBalance: vendor.walletBalance,
    kycStatus: vendor.kycStatus,
    pluginCount: vendor.plugins.length,
    subscriptionPlan: vendor.subscriptionPlan,
    subscriptionValidUntil: vendor.subscriptionValidUntil
  };
};
