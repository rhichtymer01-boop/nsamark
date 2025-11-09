import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DISPATCHED = 'dispatched',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface OrderDocument extends Document {
  customer: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  transporter?: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryAddress: string;
  deliveryLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    transporter: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    deliveryAddress: { type: String, required: true },
    deliveryLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true, default: [0, 0] }
    },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

orderSchema.index({ 'deliveryLocation': '2dsphere' });

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
