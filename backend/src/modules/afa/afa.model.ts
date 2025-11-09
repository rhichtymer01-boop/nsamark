import mongoose, { Document, Schema } from 'mongoose';

export interface AFADocument extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  number: string;
  address: string;
  ghanaCardNumber: string;
  occupation: string;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const afaSchema = new Schema<AFADocument>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    number: { type: String, required: true },
    address: { type: String, required: true },
    ghanaCardNumber: { type: String, required: true },
    occupation: { type: String, required: true },
    paid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const AFAModel = mongoose.model<AFADocument>('AFA', afaSchema);
