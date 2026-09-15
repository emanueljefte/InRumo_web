import type { Chat, Message, MessageSender } from './Chat';

export type ChatRepository = {
  getOrCreateChat(userId: string): Promise<Chat>;
  getChatById(chatId: string): Promise<Chat>;                             
  getMessages(chatId: string): Promise<Message[]>;
  sendMessage(chatId: string, content: string, sender: MessageSender): Promise<void>; 
  closeChat(chatId: string): Promise<void>;
  escalateToHuman(chatId: string): Promise<void>;
  subscribeToMessages(chatId: string, onMessage: (msg: Message) => void): () => void;
};