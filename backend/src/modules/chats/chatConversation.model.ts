import mongoose, { Document, Schema } from 'mongoose';

import { UserRole } from '../users/user.model.js';

export interface ChatParticipant {
  user: mongoose.Types.ObjectId;
  role: UserRole;
}

export interface ChatConversationDocument extends Document {
  vendor: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  participants: ChatParticipant[];
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const participantSchema = new Schema<ChatParticipant>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: Object.values(UserRole), required: true }
  },
  { _id: false }
);

const chatConversationSchema = new Schema<ChatConversationDocument>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: { type: [participantSchema], required: true },
    lastMessageAt: { type: Date }
  },
  { timestamps: true }
);

chatConversationSchema.index({ 'participants.user': 1 });
chatConversationSchema.index({ vendor: 1, customer: 1 }, { unique: true });

export const ChatConversationModel = mongoose.model<ChatConversationDocument>('ChatConversation', chatConversationSchema);
