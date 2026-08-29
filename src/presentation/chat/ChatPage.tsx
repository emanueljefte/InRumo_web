import { useEffect, useMemo, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../application/chat/useChat';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';

export default function ChatPage({ allowEscalation }: { allowEscalation: boolean }) {
  const chatRepository = useMemo(() => new SupabaseChatRepository(), []);
  const { chat, messages, sendMessage, escalate } = useChat(chatRepository);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const content = input;
    setInput('');
    await sendMessage(content);
    setSending(false);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-160px)]">
      <div className="pb-4 border-b border-outline-variant/50 space-y-1">
        <h1 className="font-heading text-headline-md text-on-surface">Orientador IA</h1>
        {chat?.status === 'escalated' && (
          <p className="font-body-sm text-xs text-tertiary">A conversa foi encaminhada para um orientador humano.</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && (
          <p className="font-body-sm text-on-surface-variant text-center py-8">
            Faz uma pergunta sobre os cursos ou o processo de admissão para começares.
          </p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-body-sm ${
                msg.sender === 'user'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl px-4 py-2.5">
              <span className="font-body-sm text-on-surface-variant">A escrever...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {allowEscalation && chat?.status === 'ai_only' && (
        <button onClick={escalate} className="self-start text-xs font-medium text-primary mb-3 hover:underline">
          Falar com orientador humano
        </button>
      )}

      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-outline-variant/50">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreve a tua mensagem..."
          disabled={sending}
          className="flex-1 border border-outline-variant rounded-xl px-4 py-2.5 font-body-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-primary-container text-on-primary-container p-2.5 rounded-xl disabled:opacity-50"
          aria-label="Enviar"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}