import { Server as HttpServer } from 'node:http';

import { Server as SocketIOServer } from 'socket.io';

import { env } from '../config/env.js';
import { ChatConversationModel } from '../modules/chats/chatConversation.model.js';
import { sendMessage } from '../modules/chats/chat.service.js';

export const initSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.corsOrigins,
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const { userId } = socket.handshake.auth as { userId?: string };
    if (!userId) {
      return next(new Error('Unauthorized'));
    }
    socket.data.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    socket.on('chat:join', async ({ conversationId }: { conversationId: string }) => {
      const conversation = await ChatConversationModel.findById(conversationId);
      if (!conversation) {
        return;
      }

      const isParticipant = conversation.participants.some(
        (participant) => participant.user.toString() === socket.data.userId
      );
      if (!isParticipant) {
        return;
      }

      socket.join(conversationId);
    });

    socket.on('chat:send', async ({ conversationId, message }: { conversationId: string; message: string }) => {
      try {
        const conversation = await ChatConversationModel.findById(conversationId);
        if (!conversation) {
          return;
        }

        const senderId = socket.data.userId as string;
        const senderParticipant = conversation.participants.find(
          (participant) => participant.user.toString() === senderId
        );
        if (!senderParticipant) {
          return;
        }

        const recipients = conversation.participants.filter(
          (participant) => participant.user.toString() !== senderId
        );
        if (recipients.length === 0) {
          return;
        }

        const persistedMessage = await sendMessage({
          conversationId,
          sender: senderId,
          recipient: recipients[0].user.toString(),
          message
        });

        io.to(conversationId).emit('chat:message', persistedMessage);
      } catch (error) {
        console.error('Socket chat error', error);
      }
    });
  });

  return io;
};
