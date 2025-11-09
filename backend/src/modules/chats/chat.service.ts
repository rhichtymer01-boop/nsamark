import mongoose from 'mongoose';

import { UserRole } from '../users/user.model.js';
import { ChatConversationModel } from './chatConversation.model.js';
import { ChatMessageDocument, ChatMessageModel } from './chat.model.js';

export interface EnsureConversationPayload {
  vendorId: string;
  customerId: string;
}

export const ensureConversation = async ({ vendorId, customerId }: EnsureConversationPayload) => {
  const conversation = await ChatConversationModel.findOne({ vendor: vendorId, customer: customerId });
  if (conversation) {
    return conversation;
  }

  return ChatConversationModel.create({
    vendor: new mongoose.Types.ObjectId(vendorId),
    customer: new mongoose.Types.ObjectId(customerId),
    participants: [
      { user: new mongoose.Types.ObjectId(vendorId), role: UserRole.VENDOR },
      { user: new mongoose.Types.ObjectId(customerId), role: UserRole.CUSTOMER }
    ]
  });
};

export const listConversationsForUser = (userId: string) =>
  ChatConversationModel.find({ 'participants.user': userId })
    .populate('participants.user', 'name role')
    .populate('vendor', 'storeName')
    .populate('customer', 'name email')
    .sort({ updatedAt: -1 })
    .lean();

export const listMessages = (conversationId: string) =>
  ChatMessageModel.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();

export interface SendMessagePayload {
  conversationId: string;
  sender: string;
  recipient: string;
  message: string;
}

export const sendMessage = async (payload: SendMessagePayload): Promise<ChatMessageDocument> => {
  const conversation = await ChatConversationModel.findById(payload.conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const allowed = conversation.participants.some((participant) => participant.user.toString() === payload.sender);
  if (!allowed) {
    throw new Error('Sender not part of conversation');
  }

  const message = await ChatMessageModel.create({
    conversation: payload.conversationId,
    sender: payload.sender,
    recipient: payload.recipient,
    message: payload.message,
    sentAt: new Date()
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  return message;
};

export const markConversationRead = async (conversationId: string, userId: string) => {
  await ChatMessageModel.updateMany(
    { conversation: conversationId, recipient: userId, read: false },
    { read: true, readAt: new Date() }
  );
};
