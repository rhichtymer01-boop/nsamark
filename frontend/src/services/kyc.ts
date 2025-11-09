import { apiClient } from './apiClient';

export interface KYCDocumentAsset {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface KYCRecord {
  _id: string;
  vendor: string | {
    _id: string;
    storeName?: string;
    category?: string;
    user?: string;
  };
  name: string;
  phone: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: KYCDocumentAsset[];
  reviewerNote?: string;
  reviewedAt?: string;
  createdAt: string;
}

export const fetchMyKYC = async () => {
  const response = await apiClient.get('/kyc/me');
  return response.data.data as KYCRecord | null;
};

export interface SubmitKYCForm {
  name: string;
  phone: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  documents: File[];
}

export const submitKYCForm = async (payload: SubmitKYCForm) => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('phone', payload.phone);
  formData.append('address', payload.address);
  formData.append('ghanaCardNumber', payload.ghanaCardNumber);
  formData.append('occupation', payload.occupation);
  payload.documents.forEach((file) => formData.append('documents', file));

  const response = await apiClient.post('/kyc', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.data as KYCRecord;
};

export const fetchKYCRequests = async () => {
  const response = await apiClient.get('/kyc');
  return response.data.data as KYCRecord[];
};

export const updateKYCReview = async (kycId: string, status: 'approved' | 'rejected', note?: string) => {
  const response = await apiClient.patch(`/kyc/${kycId}`, { status, note });
  return response.data.data as KYCRecord;
};
