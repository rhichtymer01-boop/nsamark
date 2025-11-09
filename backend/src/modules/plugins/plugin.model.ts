import mongoose, { Document, Schema } from 'mongoose';

export enum PluginType {
  SMS = 'sms',
  ADS = 'ads',
  SELL_CHECKER = 'sell-checker'
}

export interface PluginDocument extends Document {
  name: string;
  description: string;
  type: PluginType;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pluginSchema = new Schema<PluginDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: Object.values(PluginType), required: true },
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const PluginModel = mongoose.model<PluginDocument>('Plugin', pluginSchema);
