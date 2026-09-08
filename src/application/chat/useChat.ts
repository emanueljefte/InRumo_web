import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import type { Chat, Message, MessageSender } from "../../domain/chat/Chat";
import type { ChatRepository } from "../../domain/chat/ChatRepository";

export function useChat(chatRepository: ChatRepository, chatId?: string) {
  const { session } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!session) return;
    const currentSession = session.user
    async function load() {
      const c = chatId
        ? await chatRepository.getChatById(chatId)      // orientador: chat específico
        : await chatRepository.getOrCreateChat(currentSession.id); // candidato/matriculado: o próprio
      setChat(c);
      setMessages(await chatRepository.getMessages(c.id));
    }
    load();
  }, [session, chatId, chatRepository]);

  useEffect(() => {
    if (!chat) return;
    return chatRepository.subscribeToMessages(chat.id, (msg) => setMessages((prev) => [...prev, msg]));
  }, [chat, chatRepository]);

  const sendMessage = (content: string, sender: MessageSender = 'user') =>
    chat && chatRepository.sendMessage(chat.id, content, sender);

  const escalate = () => chat && chatRepository.escalateToHuman(chat.id);

  return { chat, messages, sendMessage, escalate };
}