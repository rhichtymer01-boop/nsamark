import { AFAModel } from './afa.model.js';

export interface CreateAFAPayload {
  vendor: string;
  name: string;
  number: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  paid?: boolean;
}

export const createAFARecord = (payload: CreateAFAPayload) => AFAModel.create(payload);

export const listAFARecordsForVendor = (vendorId: string) => AFAModel.find({ vendor: vendorId }).lean();
