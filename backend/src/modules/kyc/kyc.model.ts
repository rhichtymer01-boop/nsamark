import mongoose, { Document, Schema } from 'mongoose';

export interface KYCDocumentAsset {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface KYCDocument extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: KYCDocumentAsset[];
  reviewerNote?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<KYCDocumentAsset>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const kycSchema = new Schema<KYCDocument>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    ghanaCardNumber: { type: String, required: true },
    occupation: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    documents: { type: [documentSchema], default: [] },
    reviewerNote: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

export const KYCModel = mongoose.model<KYCDocument>('KYC', kycSchema);
