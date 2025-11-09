import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

import { apiClient } from '../services/apiClient';

interface ChatParticipant {
  user: {
    _id: string;
    name: string;
    role: string;
  };
  role: string;
}

interface ChatConversation {
  _id: string;
  participants: ChatParticipant[];
  vendor?: { storeName: string };
  customer?: { name: string; email: string };
  lastMessageAt?: string;
}

interface ChatMessage {
  _id: string;
  conversation: string;
  sender: string;
  recipient: string;
  message: string;
  sentAt: string;
}

let socket: Socket | null = null;

const resolveSocketUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  return baseUrl.replace(/\/?api$/, '');
};

const ChatPage = () => {
  const queryClient = useQueryClient();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState<Record<string, ChatMessage[]>>({});

  const currentUserId = useMemo(() => {
    return localStorage.getItem('nsamark:userId') ?? 'demo-customer-id';
  }, []);

  const { data: conversations } = useQuery<ChatConversation[]>({
    queryKey: ['chats', 'conversations'],
    queryFn: async () => {
      const response = await apiClient.get('/chats/conversations');
      return response.data.data ?? [];
    }
  });

  const selectedConversation = conversations?.find((conversation) => conversation._id === selectedConversationId) ?? null;

  const { data: messages } = useQuery<ChatMessage[]>({
    enabled: Boolean(selectedConversationId),
    queryKey: ['chats', 'messages', selectedConversationId],
    queryFn: async () => {
      const response = await apiClient.get(`/chats/conversations/${selectedConversationId}/messages`);
      return response.data.data ?? [];
    }
  });

  useEffect(() => {
    if (!socket) {
      socket = io(resolveSocketUrl(), {
        auth: { userId: currentUserId }
      });
    }

    const handleIncomingMessage = (payload: ChatMessage) => {
      setOptimisticMessages((prev) => {
        const list = prev[payload.conversation] ?? [];
        return {
          ...prev,
          [payload.conversation]: [...list.filter((item) => item._id !== payload._id), payload]
        };
      });
      queryClient.invalidateQueries({ queryKey: ['chats', 'messages', payload.conversation] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'conversations'] });
    };

    socket.on('chat:message', handleIncomingMessage);

    return () => {
      socket?.off('chat:message', handleIncomingMessage);
    };
  }, [currentUserId, queryClient]);

  useEffect(() => {
    if (selectedConversationId && socket) {
      socket.emit('chat:join', { conversationId: selectedConversationId });
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId && conversations?.length) {
      setSelectedConversationId(conversations[0]._id);
    }
  }, [conversations, selectedConversationId]);

  const sendMutation = useMutation({
    mutationFn: async ({ conversationId, recipientId, message: text }: { conversationId: string; recipientId: string; message: string }) => {
      await apiClient.post(`/chats/conversations/${conversationId}/messages`, {
        recipientId,
        message: text
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chats', 'messages', variables.conversationId] });
      setMessage('');
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message || !selectedConversation) {
      return;
    }

    const recipient = selectedConversation.participants.find((participant) => participant.user._id !== currentUserId);
    if (!recipient) {
      return;
    }

    const conversationId = selectedConversation._id;

    setOptimisticMessages((prev) => {
      const conversationMessages = prev[conversationId] ?? [];
      const optimisticMessage: ChatMessage = {
        _id: `optimistic-${Date.now()}`,
        conversation: conversationId,
        sender: currentUserId,
        recipient: recipient.user._id,
        message,
        sentAt: new Date().toISOString()
      };
      return { ...prev, [conversationId]: [...conversationMessages, optimisticMessage] };
    });

    sendMutation.mutate({ conversationId, recipientId: recipient.user._id, message });
  };

  const mergedMessages = useMemo(() => {
    if (!selectedConversationId) {
      return [] as ChatMessage[];
    }
    const persisted = messages ?? [];
    const optimistic = optimisticMessages[selectedConversationId] ?? [];
    const filteredOptimistic = optimistic.filter(
      (opt) => !persisted.some((item) => item._id === opt._id || item.message === opt.message && item.sentAt === opt.sentAt)
    );
    return [...persisted, ...filteredOptimistic].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
  }, [messages, optimisticMessages, selectedConversationId]);

  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
      <aside className="h-[70vh] w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-700">Conversations</h2>
        </div>
        <ul className="h-full overflow-y-auto">
          {conversations?.map((conversation) => {
            const otherParticipant = conversation.participants.find((participant) => participant.user._id !== currentUserId);
            return (
              <li
                key={conversation._id}
                onClick={() => setSelectedConversationId(conversation._id)}
                className={`cursor-pointer border-b border-slate-100 px-4 py-3 text-sm transition hover:bg-primary/10 ${
                  selectedConversationId === conversation._id ? 'bg-primary/10' : ''
                }`}
              >
                <p className="font-medium text-slate-700">{otherParticipant?.user.name ?? 'Conversation'}</p>
                <p className="text-xs text-slate-500">
                  {conversation.vendor?.storeName ? `Vendor: ${conversation.vendor.storeName}` : ''}
                </p>
              </li>
            );
          })}
          {!conversations?.length && (
            <li className="px-4 py-6 text-center text-sm text-slate-500">No conversations yet.</li>
          )}
        </ul>
      </aside>

      <section className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm">
        {selectedConversation ? (
          <div className="flex h-full flex-col">
            <header className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-700">
                {selectedConversation.participants.find((participant) => participant.user._id !== currentUserId)?.user.name ?? 'Chat'}
              </h3>
              <p className="text-xs text-slate-500">Real-time chat between vendors and customers</p>
            </header>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {mergedMessages.map((msg) => {
                const isMine = msg.sender === currentUserId;
                return (
                  <div
                    key={msg._id}
                    className={`max-w-md rounded-lg px-3 py-2 text-sm shadow-sm ${
                      isMine ? 'ml-auto bg-primary text-white' : 'mr-auto bg-slate-100 text-slate-700'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="mt-1 block text-[10px] opacity-70">
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              {!mergedMessages.length && (
                <div className="py-10 text-center text-sm text-slate-400">Start the conversation</div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="border-t border-slate-200 px-4 py-3">
              <div className="flex gap-3">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Type a message"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Select a conversation to begin chatting
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
