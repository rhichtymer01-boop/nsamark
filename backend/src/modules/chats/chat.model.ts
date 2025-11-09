import mongoose, { Document, Schema } from 'mongoose';

export interface ChatMessageDocument extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  sentAt: Date;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<ChatMessageDocument>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
    readAt: { type: Date }
  },
  { timestamps: true }
);

chatMessageSchema.index({ conversation: 1, createdAt: 1 });

export const ChatMessageModel = mongoose.model<ChatMessageDocument>('ChatMessage', chatMessageSchema);
