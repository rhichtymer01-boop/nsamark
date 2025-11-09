import mongoose, { Document, Schema } from 'mongoose';

export enum SubscriptionPlanType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface SubscriptionDocument extends Document {
  name: string;
  planType: SubscriptionPlanType;
  price: number;
  benefits: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    name: { type: String, required: true },
    planType: { type: String, enum: Object.values(SubscriptionPlanType), required: true },
    price: { type: Number, required: true },
    benefits: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SubscriptionModel = mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema);
