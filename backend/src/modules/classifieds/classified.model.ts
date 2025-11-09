import mongoose, { Document, Schema } from 'mongoose';

export interface ClassifiedDocument extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  seller: mongoose.Types.ObjectId;
  location?: string;
  media: string[];
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const classifiedSchema = new Schema<ClassifiedDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String },
    media: [{ type: String }],
    contactNumber: { type: String, required: true }
  },
  { timestamps: true }
);

classifiedSchema.index({ title: 'text', description: 'text', category: 1 });

export const ClassifiedModel = mongoose.model<ClassifiedDocument>('Classified', classifiedSchema);
