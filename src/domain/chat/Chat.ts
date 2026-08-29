export type ChatStatus = 'ai_only' | 'escalated' | 'closed';
export type MessageSender = 'user' | 'ai' | 'orientador';

export type Message = {
  id: string;
  chatId: string;
  sender: MessageSender;
  content: string;
  createdAt: string;
};

export type Chat = {
  id: string;
  userId: string;
  status: ChatStatus;
  createdAt: string;
};