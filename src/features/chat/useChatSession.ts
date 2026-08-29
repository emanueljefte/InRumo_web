import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';

export type ChatMessage = {
  id: string;
  session_id: string;
  sender: 'user' | 'ai' | 'advisor';
  content: string;
  created_at: string;
  sendStatus?: 'sent' | 'pending' | 'failed';
};

type ChatSession = {
  id: string;
  user_id: string;
  status: 'ai' | 'escalated' | 'closed';
};

export function useChatSession() {
  const { session: authSession } = useAuth();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadMessages = useCallback(async (sessionId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    setMessages((data ?? []) as ChatMessage[]);
  }, []);

  // busca ou cria a sessão + assina Realtime pra mensagens novas (ex: orientador respondendo)
  useEffect(() => {
    if (!authSession?.user) return;

    (async () => {
      const { data: existing } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', authSession.user.id)
        .maybeSingle();

      let activeSession = existing;

      if (!activeSession) {
        const { data: created } = await supabase
          .from('chat_sessions')
          .insert({ user_id: authSession.user.id, status: 'ai' })
          .select('*')
          .single();
        activeSession = created;
      }

      setSession(activeSession);
      if (activeSession) await loadMessages(activeSession.id);
    })();
  }, [authSession?.user?.id, loadMessages]);

  // Realtime: escuta mensagens novas na sessão (útil quando orientador humano responde)
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`chat_messages:${session.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${session.id}` },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev; // evita duplicar a que já inserimos localmente
            return [...prev, newMessage];
          });
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          setSession(payload.new as ChatSession);
        },
      )
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [session?.id]);

  const dispatchMessage = useCallback(async (localMessage: ChatMessage) => {
    if (!session) return;
    setSending(true);

    const { data, error } = await supabase.functions.invoke('chat-ai', {
      body: { sessionId: session.id, userId: session.user_id, message: localMessage.content },
    });

    setSending(false);

    if (error || !data) {
      setMessages((prev) => prev.map((m) => (m.id === localMessage.id ? { ...m, sendStatus: 'failed' } : m)));
      return;
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === localMessage.id ? { ...m, sendStatus: 'sent' } : m)),
    );
    // a resposta da IA chega via Realtime (INSERT em chat_messages) — não precisa inserir manualmente aqui

    if (data.escalated) {
      setSession((prev) => (prev ? { ...prev, status: 'escalated' } : prev));
    }
  }, [session]);

  const send = useCallback(async () => {
    if (!session || !input.trim() || sending) return;
    const content = input.trim();
    setInput('');

    const localMessage: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: session.id,
      sender: 'user',
      content,
      created_at: new Date().toISOString(),
      sendStatus: 'pending',
    };
    setMessages((prev) => [...prev, localMessage]);

    await dispatchMessage(localMessage);
  }, [session, input, sending, dispatchMessage]);

  const retry = useCallback(async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, sendStatus: 'pending' } : m)));
    await dispatchMessage(message);
  }, [messages, dispatchMessage]);

  return { messages, session, input, setInput, send, retry, sending };
}