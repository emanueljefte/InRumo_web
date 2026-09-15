import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import type { Chat, Message, MessageSender } from "../../domain/chat/Chat";
import type { ChatRepository } from "../../domain/chat/ChatRepository";

export function useChat(chatRepository: ChatRepository, chatId?: string) {
  const { session } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);


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

  const sendMessage = async (content: string, sender: MessageSender = 'user') => {
    if (!chat) return;
    setError(null);
    try {
      await chatRepository.sendMessage(chat.id, content, sender);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível enviar a mensagem.';
      setError(message);
      throw err; // continua a propagar, para quem chamou (ChatPage) também poder reagir
    }
  };

  const escalate = () => chat && chatRepository.escalateToHuman(chat.id);

  return { chat, messages, sendMessage, escalate, error };
}