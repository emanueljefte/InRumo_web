import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Send,
  Loader2,
  UserCheck,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { useChat } from '../../application/chat/useChat';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';

interface ChatPageProps {
  allowEscalation: boolean;
  chatId?: string;
  senderRole?: 'user' | 'orientador';
}

const chatRepository = new SupabaseChatRepository();

// Sugestões de perguntas frequentes para início de conversa
const QUICK_PROMPTS = [
  'Quais são os cursos disponíveis?',
  'Como funciona o processo de candidatura?',
  'Quais os requisitos de acesso ao ensino superior?',
  'Como posso agendar uma sessão individual?'
];

export default function ChatPage({
  allowEscalation,
  chatId,
  senderRole = 'user'
}: ChatPageProps) {
  const { chat, messages, sendMessage, escalate } = useChat(chatRepository, chatId);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [escalating, setEscalating] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll suave para o fundo a cada nova mensagem ou estado de envio
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending, scrollToBottom]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = (customMessage || input).trim();
    if (!textToSend || sending) return;

    setSending(true);
    if (!customMessage) setInput('');

    try {
      await sendMessage(textToSend, senderRole);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      if (!customMessage) setInput(textToSend); // Restaura o input em caso de falha
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleEscalate = async () => {
    if (escalating) return;
    setEscalating(true);
    try {
      await escalate();
    } catch (err) {
      console.error('Erro ao transferir para humano:', err);
    } finally {
      setEscalating(false);
    }
  };

  const isHumanAgent = chat?.status === 'escalated';

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] bg-surface-container-lowest border border-outline-variant/40 sm:rounded-3xl shadow-sm overflow-hidden animate-fadeIn">
      
      {/* Header do Chat */}
      <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest/90 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-colors ${
              isHumanAgent
                ? 'bg-tertiary/10 text-tertiary'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {isHumanAgent ? <UserCheck size={22} /> : <Bot size={22} />}
          </div>
          <div>
            <h1 className="font-heading text-sm sm:text-base font-bold text-on-surface leading-tight flex items-center gap-2">
              <span>Orientador Vocacional</span>
              {isHumanAgent && (
                <span className="text-[10px] font-semibold bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full">
                  Humano
                </span>
              )}
            </h1>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              {isHumanAgent ? (
                <span className="text-tertiary flex items-center gap-1 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  Sessão com Orientador Humano
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Assistente de IA Ativo
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Botão de Transição para Orientador Humano */}
        {allowEscalation && !isHumanAgent && (
          <button
            type="button"
            onClick={handleEscalate}
            disabled={escalating}
            className="text-xs font-semibold text-primary bg-primary-container/30 hover:bg-primary-container/60 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 border border-primary/20 cursor-pointer"
            title="Solicitar atendimento com orientador humano"
          >
            {escalating ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <UserCheck size={14} />
            )}
            <span className="hidden sm:inline">Falar com Humano</span>
            <span className="sm:hidden">Humano</span>
          </button>
        )}
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="text-center py-8 sm:py-12 space-y-6 max-w-md mx-auto my-auto animate-fadeIn">
            <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
              <Sparkles size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-lg font-bold text-on-surface">
                Olá! Como posso ajudar-te hoje?
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Posso esclarecer dúvidas sobre cursos, critérios de acesso e orientar o teu percurso académico.
              </p>
            </div>

            {/* Prompt Quick Options */}
            <div className="space-y-2 pt-2 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex items-center gap-1">
                <HelpCircle size={12} /> Sugestões de perguntas:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border border-outline-variant/40 rounded-xl p-3 text-on-surface transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <Send size={12} className="text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isOrientador = msg.sender === 'orientador';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {/* Avatar para o assistente / orientador */}
                {!isUser && (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isOrientador
                        ? 'bg-tertiary/10 text-tertiary border border-tertiary/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {isOrientador ? <User size={16} /> : <Bot size={16} />}
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs transition-all ${
                    isUser
                      ? 'bg-primary text-on-primary rounded-tr-xs font-medium'
                      : isOrientador
                      ? 'bg-tertiary-container/30 text-on-tertiary-container rounded-tl-xs border border-tertiary/20'
                      : 'bg-surface-container-low text-on-surface rounded-tl-xs border border-outline-variant/40'
                  }`}
                >
                  {/* Nome do Remetente no balão quando não é o próprio utilizador */}
                  {!isUser && (
                    <span className="block text-[10px] font-bold mb-1 opacity-75 uppercase tracking-wider">
                      {isOrientador ? 'Orientador Humano' : 'Assistente AI'}
                    </span>
                  )}

                  <p>{msg.content}</p>

                  {/* Timestamp */}
                  {msg.createdAt && (
                    <span
                      className={`block text-[10px] mt-1.5 text-right opacity-60 flex items-center justify-end gap-1 ${
                        isUser ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>

                {/* Avatar do Utilizador */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Indicador de Escrita (Typing) */}
        {sending && (
          <div className="flex justify-start gap-2.5 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Caixa de Entrada de Mensagem */}
      <div className="p-3 sm:p-4 border-t border-outline-variant/30 bg-surface-container-lowest shrink-0 z-10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreve a tua mensagem aqui..."
            disabled={sending}
            className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-on-primary p-3 rounded-2xl disabled:opacity-40 disabled:hover:bg-primary transition-all shrink-0 shadow-xs cursor-pointer flex items-center justify-center"
            aria-label="Enviar mensagem"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}