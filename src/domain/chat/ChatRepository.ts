import type { Chat, Message } from './Chat';

export type ChatRepository = {
  getOrCreateChat(userId: string): Promise<Chat>;
  getMessages(chatId: string): Promise<Message[]>;
  sendMessage(chatId: string, content: string): Promise<void>;
  escalateToHuman(chatId: string): Promise<void>;
  subscribeToMessages(chatId: string, onMessage: (msg: Message) => void): () => void;
};