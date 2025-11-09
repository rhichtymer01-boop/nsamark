import { randomUUID } from 'node:crypto';

import { InternetVendorModel } from './internetVendor.model.js';

export const configureInternetVendor = (vendorId: string, networks: string[]) =>
  InternetVendorModel.findOneAndUpdate(
    { vendor: vendorId },
    { vendor: vendorId, supportedNetworks: networks },
    { new: true, upsert: true }
  );

export const listInternetVendors = () => InternetVendorModel.find().populate('vendor').lean();

export const simulateSmsDispatch = async (vendorId: string, recipients: string[], message: string) => {
  const vendor = await InternetVendorModel.findOne({ vendor: vendorId });
  if (!vendor) {
    throw new Error('Internet vendor not configured');
  }

  const reference = randomUUID();

  // For now, we simply return a simulated dispatch payload.
  return {
    vendorId,
    recipients,
    message,
    reference,
    network: vendor.supportedNetworks,
    dispatchedAt: new Date().toISOString()
  };
};
