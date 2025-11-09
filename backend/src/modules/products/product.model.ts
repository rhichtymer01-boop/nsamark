import mongoose, { Document, Schema } from 'mongoose';

export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  SERVICE = 'service'
}

export interface ProductDocument extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isPublished: boolean;
  media: string[];
  tags: string[];
  type: ProductType;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    media: [{ type: String }],
    tags: [{ type: String }],
    type: {
      type: String,
      enum: Object.values(ProductType),
      default: ProductType.PHYSICAL
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 1 });

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
