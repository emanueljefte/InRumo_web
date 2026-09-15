import { supabase } from '../../api/supabase';
import type { Chat, ChatStatus, Message, MessageSender } from '../../domain/chat/Chat';
import type { ChatRepository } from '../../domain/chat/ChatRepository';
import type { ChatModerationRepository, EscalatedChat } from '../../domain/schedule/ChatModeration';
import type { CourseId } from '../../domain/test/TestQuestion';
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
  profiles: { nome: string; curso_id: CourseId | null };
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
      const { data: chat } = await supabase.from('chats').select('status').eq('id', chatId).single();

      if (chat?.status === 'ai_only') { // só chama a IA se ainda não foi escalado
        const response = await supabase.functions.invoke('ai-chat-reply', { body: { chatId, content } });
        if (response.error) {
          let message = 'Não foi possível obter resposta do Orientador IA.';
          try {
            const body = await response.error.context.json();
            message = body?.error ?? message;
          } catch {
            throw new Error(message);
          }
        }
      }
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
    .select('id, user_id, profiles(nome, curso_id), messages(content, created_at)')
    .eq('status', 'escalated')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = data as unknown as ChatWithRelationsRow[];

  const results = await Promise.all(rows.map(async (c) => {
    const lastMessage = c.messages[c.messages.length - 1];

    const { data: resultData } = await supabase
      .from('test_results')
      .select('recommended_area_id')
      .eq('user_id', c.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let areaNome: string | null = null;
    if (resultData?.recommended_area_id) {
      const { data: areaData } = await supabase.from('areas').select('nome').eq('id', resultData.recommended_area_id).maybeSingle();
      areaNome = areaData?.nome ?? null;
    }

    return {
      id: c.id,
      userId: c.user_id,
      userNome: c.profiles?.nome ?? 'Utilizador',
      cursoId: c.profiles?.curso_id ?? null,
      areaNome,
      lastMessage: lastMessage?.content ?? '',
      updatedAt: lastMessage?.created_at ?? '',
    };
  }));

  return results;
}

  async closeChat(chatId: string) {
    const { error } = await supabase.from('chats').update({ status: 'closed' }).eq('id', chatId);
    if (error) throw error;
  }
}

function mapChat(row: ChatRow): Chat {
  return { id: row.id, userId: row.user_id, status: row.status, createdAt: row.created_at };
}
function mapMessage(row: MessageRow): Message {
  return { id: row.id, chatId: row.chat_id, sender: row.sender, content: row.content, createdAt: row.created_at };
}

