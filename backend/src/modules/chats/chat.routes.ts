import { Router } from 'express';

import { authenticate } from '../../middlewares/authMiddleware.js';
import {
  createConversation,
  getConversationMessages,
  getConversations,
  markConversationAsRead,
  sendChatMessage
} from './chat.controller.js';

export const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get('/conversations', getConversations);
chatRouter.post('/conversations', createConversation);
chatRouter.get('/conversations/:conversationId/messages', getConversationMessages);
chatRouter.post('/conversations/:conversationId/messages', sendChatMessage);
chatRouter.post('/conversations/:conversationId/read', markConversationAsRead);
