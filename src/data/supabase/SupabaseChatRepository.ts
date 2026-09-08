import { supabase } from '../../api/supabase';
import type { Chat, ChatStatus, Message, MessageSender } from '../../domain/chat/Chat';
import type { ChatRepository } from '../../domain/chat/ChatRepository';
import type { ChatModerationRepository, EscalatedChat } from '../../domain/schedule/ChatModeration';
import { SupabaseNotificationRepository } from './SupabaseNotificationRepository';

type ChatRow = {
  id: string;
  user_id: string;
  status: ChatStatus;
  created_at: string;
};

type MessageRow = {
  id: string;
  chat_id: string;
  sender: MessageSender;
  content: string;
  created_at: string;
};

type ChatWithRelationsRow = {
  id: string;
  user_id: string;
  profiles: { nome: string }[];
  messages: { content: string; created_at: string }[];
};

export class SupabaseChatRepository implements ChatRepository, ChatModerationRepository {
  async getOrCreateChat(userId: string) {
    const { data: existing } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'closed')
      .maybeSingle();

    if (existing) return mapChat(existing);

    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return mapChat(data as ChatRow);
  }

  async getMessages(chatId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => mapMessage(row as MessageRow));
  }

  async getChatById(chatId: string): Promise<Chat> {
    const { data, error } = await supabase.from('chats').select('*').eq('id', chatId).single();
    if (error) throw error;
    return mapChat(data as ChatRow);
  }

  async sendMessage(chatId: string, content: string, sender: MessageSender = 'user') {
    const { error } = await supabase.from('messages').insert({ chat_id: chatId, sender, content });
    if (error) throw error;

    if (sender === 'user') {
      await supabase.functions.invoke('ai-chat-reply', { body: { chatId, content } }); // só dispara IA se for o utilizador, não quando o orientador responde
    }
  }

  async escalateToHuman(chatId: string) {
  const { error } = await supabase.from('chats').update({ status: 'escalated' }).eq('id', chatId);
  if (error) throw error;

  const notificationRepo = new SupabaseNotificationRepository();
  const orientadores = await supabase.from('profiles').select('id').eq('papel', 'orientador');
  for (const o of orientadores.data ?? []) {
    await notificationRepo.create(o.id, 'chat_escalado', 'Uma conversa foi escalada para orientação humana.');
  }
}

  subscribeToMessages(chatId: string, onMessage: (msg: Message) => void) {
    const channel = supabase
      .channel(`messages:${chatId}`)
      .on<MessageRow>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => onMessage(mapMessage(payload.new))
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }


  async getEscalatedChats(): Promise<EscalatedChat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('id, user_id, profiles(nome), messages(content, created_at)')
      .eq('status', 'escalated')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as ChatWithRelationsRow[]).map((c) => {
      const lastMessage = c.messages[c.messages.length - 1];
      return {
        id: c.id,
        userId: c.user_id,
        userNome: c.profiles?.[0]?.nome ?? 'Utilizador',
        lastMessage: lastMessage?.content ?? '',
        updatedAt: lastMessage?.created_at ?? '',
      };
    });
  }
}

function mapChat(row: ChatRow): Chat {
  return { id: row.id, userId: row.user_id, status: row.status, createdAt: row.created_at };
}
function mapMessage(row: MessageRow): Message {
  return { id: row.id, chatId: row.chat_id, sender: row.sender, content: row.content, createdAt: row.created_at };
}

