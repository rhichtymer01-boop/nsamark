import mongoose, { Document, Schema } from 'mongoose';

export interface WalletTransaction {
  amount: number;
  type: 'credit' | 'debit';
  reference: string;
  description?: string;
  createdAt: Date;
}

export interface WalletDocument extends Document {
  owner: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<WalletDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'GHS' },
    transactions: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ['credit', 'debit'], required: true },
        reference: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const WalletModel = mongoose.model<WalletDocument>('Wallet', walletSchema);
