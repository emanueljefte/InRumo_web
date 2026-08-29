import { supabase } from '../../api/supabase';
import type { Chat, ChatStatus, Message, MessageSender } from '../../domain/chat/Chat';
import type { ChatRepository } from '../../domain/chat/ChatRepository';

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

export class SupabaseChatRepository implements ChatRepository {
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

  async sendMessage(chatId: string, content: string) {
    const { error } = await supabase.from('messages').insert({ chat_id: chatId, sender: 'user', content });
    if (error) throw error;

    // dispara a resposta da IA (RF19) via edge function
    await supabase.functions.invoke('ai-chat-reply', { body: { chatId, content } });
  }

  async escalateToHuman(chatId: string) {
    const { error } = await supabase.from('chats').update({ status: 'escalated' }).eq('id', chatId);
    if (error) throw error; // RLS bloqueia se não for matriculado
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
}

function mapChat(row: ChatRow): Chat {
  return { id: row.id, userId: row.user_id, status: row.status, createdAt: row.created_at };
}
function mapMessage(row: MessageRow): Message {
  return { id: row.id, chatId: row.chat_id, sender: row.sender, content: row.content, createdAt: row.created_at };
}