import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import type { Chat, Message } from "../../domain/chat/Chat";
import type { ChatRepository } from "../../domain/chat/ChatRepository";

export function useChat(chatRepository: ChatRepository) {
  const { session } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!session) return;
    chatRepository.getOrCreateChat(session.user.id).then(async (c) => {
      setChat(c);
      setMessages(await chatRepository.getMessages(c.id));
    });
  }, [session, chatRepository]);

  useEffect(() => {
    if (!chat) return;
    return chatRepository.subscribeToMessages(chat.id, (msg) => setMessages((prev) => [...prev, msg]));
  }, [chat, chatRepository]);

  const sendMessage = (content: string) => chat && chatRepository.sendMessage(chat.id, content);
  const escalate = () => chat && chatRepository.escalateToHuman(chat.id);

  return { chat, messages, sendMessage, escalate };
}