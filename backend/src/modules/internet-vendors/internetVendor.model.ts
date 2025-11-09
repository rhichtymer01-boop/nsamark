import mongoose, { Document, Schema } from 'mongoose';

export interface InternetVendorDocument extends Document {
  vendor: mongoose.Types.ObjectId;
  supportedNetworks: string[];
  smsCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

const internetVendorSchema = new Schema<InternetVendorDocument>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true, unique: true },
    supportedNetworks: [{ type: String, enum: ['MTN', 'AirtelTigo', 'Telecel'] }],
    smsCredits: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const InternetVendorModel = mongoose.model<InternetVendorDocument>('InternetVendor', internetVendorSchema);
