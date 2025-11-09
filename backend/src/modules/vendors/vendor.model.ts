import mongoose, { Document, Schema } from 'mongoose';

export enum VendorCategory {
  COLD_STORE = 'cold-store',
  RESTAURANT = 'restaurant',
  PRE_ORDER = 'pre-order',
  BET_PREDICTOR = 'bet-predictor',
  PHONE_SHOP = 'phone-shop',
  MINI_MART = 'mini-mart',
  CARPENTER = 'carpenter',
  TRANSPORTER = 'transporter',
  DIGITAL_PRODUCTS = 'digital-products',
  INTERNET_VENDOR = 'internet-vendor'
}

export enum TransporterType {
  MOTOR_RIDER = 'motor-rider',
  TRICYCLE = 'tricycle',
  TAXI = 'taxi',
  CARGO = 'cargo'
}

export interface VendorDocument extends Document {
  user: mongoose.Types.ObjectId;
  category: VendorCategory;
  transporterType?: TransporterType;
  storeName: string;
  description?: string;
  logoUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  kycStatus: 'pending' | 'approved' | 'rejected';
  subscriptionPlan?: string;
  subscriptionValidUntil?: Date;
  plugins: Array<{
    pluginId: mongoose.Types.ObjectId;
    active: boolean;
    activatedAt: Date;
  }>;
  revenue: number;
  walletBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<VendorDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: Object.values(VendorCategory),
      required: true
    },
    transporterType: {
      type: String,
      enum: Object.values(TransporterType)
    },
    storeName: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      whatsapp: { type: String }
    },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true, default: [0, 0] }
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    subscriptionPlan: { type: String },
    subscriptionValidUntil: { type: Date },
    plugins: [
      {
        pluginId: { type: Schema.Types.ObjectId, ref: 'Plugin', required: true },
        active: { type: Boolean, default: true },
        activatedAt: { type: Date, default: Date.now }
      }
    ],
    revenue: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

vendorSchema.index({ location: '2dsphere' });

export const VendorModel = mongoose.model<VendorDocument>('Vendor', vendorSchema);
