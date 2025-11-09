import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import {
  ensureConversation,
  listConversationsForUser,
  listMessages,
  markConversationRead,
  sendMessage
} from './chat.service.js';

export const createConversation = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const { vendorId, customerId } = req.body;
  if (!vendorId || !customerId) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'vendorId and customerId required' });
  }

  const conversation = await ensureConversation({ vendorId, customerId });
  res.status(httpStatus.CREATED).json({ success: true, data: conversation });
};

export const getConversations = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const conversations = await listConversationsForUser(req.user._id);
  res.json({ success: true, data: conversations });
};

export const getConversationMessages = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const messages = await listMessages(req.params.conversationId);
  res.json({ success: true, data: messages });
};

export const sendChatMessage = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  const { conversationId } = req.params;
  const { recipientId, message } = req.body;

  if (!recipientId || !message) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'recipientId and message required' });
  }

  const chatMessage = await sendMessage({
    conversationId,
    sender: req.user._id,
    recipient: recipientId,
    message
  });

  res.status(httpStatus.CREATED).json({ success: true, data: chatMessage });
};

export const markConversationAsRead = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Unauthorized' });
  }

  await markConversationRead(req.params.conversationId, req.user._id);
  res.json({ success: true });
};
