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
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../../application/chat/useChat';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';

interface ChatPageProps {
  allowEscalation: boolean;
  chatId?: string;
  senderRole?: 'user' | 'orientador';
}

const chatRepository = new SupabaseChatRepository();

const QUICK_PROMPTS = [
  'Quais são os cursos disponíveis?',
  'Como funciona o processo de candidatura?',
  'Quais os requisitos de acesso ao ensino superior?',
  'Como posso agendar uma sessão individual?',
];

export default function ChatPage({
  allowEscalation,
  chatId,
  senderRole = 'user',
}: ChatPageProps) {
  const { chat, messages, sendMessage, escalate } = useChat(chatRepository, chatId);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [escalating, setEscalating] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (!customMessage) setInput(textToSend);
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
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] bg-surface-container-lowest border border-outline-variant/20 sm:rounded-3xl shadow-sm overflow-hidden font-body text-on-surface antialiased">
      
      {/* 1. HEADER DO CHAT: Separado com borda suave e desfoque */}
      <header className="p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between bg-surface-container-lowest/90 backdrop-blur-md shrink-0 z-10 border-b border-outline-variant/15">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold transition-all border ${
                isHumanAgent
                  ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}
            >
              {isHumanAgent ? <UserCheck size={22} /> : <Bot size={22} />}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-surface-container-lowest ${
                isHumanAgent ? 'bg-tertiary' : 'bg-emerald-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-sm sm:text-base font-bold text-on-surface leading-tight">
                Orientador Vocacional
              </h1>
              {isHumanAgent ? (
                <span className="text-[10px] font-bold uppercase bg-tertiary/10 text-tertiary border border-tertiary/20 px-2 py-0.5 rounded-full">
                  Humano
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={10} /> IA Active
                </span>
              )}
            </div>

            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              {isHumanAgent ? (
                <span className="text-tertiary font-medium text-[11px]">
                  Sessão ativa com assistente humano
                </span>
              ) : (
                <span className="text-[11px] text-on-surface-variant/80">
                  Respostas imediatas e personalizadas
                </span>
              )}
            </p>
          </div>
        </div>

        {allowEscalation && !isHumanAgent && (
          <button
            type="button"
            onClick={handleEscalate}
            disabled={escalating}
            className="text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3.5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
            title="Solicitar atendimento com orientador humano"
          >
            {escalating ? (
              <Loader2 size={15} className="animate-spin text-primary" />
            ) : (
              <UserCheck size={15} />
            )}
            <span className="hidden sm:inline">Falar com Humano</span>
            <span className="sm:hidden">Humano</span>
          </button>
        )}
      </header>

      {/* 2. ÁREA DE MENSAGENS: Fundo levemente contrastante para destacar os cartões */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface-container-low/20">
        {messages.length === 0 ? (
          /* ESTADO VAZIO / BOAS-VINDAS: Cards bem delineados */
          <div className="text-center py-8 sm:py-12 space-y-6 max-w-lg mx-auto my-auto animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl font-extrabold text-on-surface tracking-tight">
                Como posso ajudar a tua jornada hoje?
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed max-w-sm mx-auto">
                Faz perguntas sobre cursos, critérios de candidatura e orientações para o teu futuro académico.
              </p>
            </div>

            {/* Sugestões Rápidas: Cards bem perceptíveis com borda leve e hover pronunciado */}
            <div className="space-y-2.5 pt-2 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex items-center gap-1.5 px-1">
                <HelpCircle size={13} className="text-primary" /> Sugestões rápidas:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/25 hover:border-primary/40 rounded-2xl p-3.5 text-on-surface shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                  >
                    <span className="font-medium pr-2 group-hover:text-primary transition-colors leading-snug">
                      {prompt}
                    </span>
                    <Send size={13} className="text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 text-[11px] text-on-surface-variant/60">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} /> Dados protegidos
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MessageSquare size={12} /> Atendimento Oficial
              </span>
            </div>
          </div>
        ) : (
          /* BALÕES DE MENSAGENS: Perceptíveis, bem delimitados e com elevação suave */
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isOrientador = msg.sender === 'orientador';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 border ${
                      isOrientador
                        ? 'bg-tertiary/10 text-tertiary border-tertiary/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                  >
                    {isOrientador ? <User size={16} /> : <Bot size={16} />}
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-2xs transition-all border ${
                    isUser
                      ? 'bg-primary text-on-primary border-primary/80 rounded-br-xs font-medium'
                      : isOrientador
                      ? 'bg-tertiary-container/30 text-on-tertiary-container border-tertiary/25 rounded-bl-xs'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant/20 rounded-bl-xs'
                  }`}
                >
                  {!isUser && (
                    <span className="block text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1 border-b border-current/10 pb-1">
                      {isOrientador ? 'Orientador Humano' : 'Assistente AI'}
                    </span>
                  )}

                  <p>{msg.content}</p>

                  {msg.createdAt && (
                    <span
                      className={`block text-[10px] mt-1.5 text-right opacity-60 flex items-center justify-end gap-1 ${
                        isUser ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* INDICADOR DE DIGITAÇÃO */}
        {sending && (
          <div className="flex justify-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 3. CAIXA DE ENTRADA (FLOATING CONTAINER EXPERIENCE): Destaque e bordas perceptíveis */}
      <footer className="p-3.5 sm:p-4 bg-surface-container-lowest shrink-0 z-10 border-t border-outline-variant/15">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreve a tua mensagem aqui..."
            disabled={sending}
            className="w-full bg-surface-container-low/60 hover:bg-surface-container-low border border-outline-variant/30 focus:border-primary/60 focus:bg-surface-container-lowest rounded-2xl pl-4 pr-12 py-3.5 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 shadow-2xs"
          />
          
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="absolute right-2 bg-primary hover:bg-primary/90 text-on-primary p-2.5 rounded-xl disabled:opacity-30 transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
            aria-label="Enviar mensagem"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-on-surface-variant/60">
          <span className="hidden sm:inline-flex items-center gap-1">
            Pressiona <kbd className="px-1 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 font-mono">Enter</kbd> para enviar
          </span>
          <span className="ml-auto">Respostas baseadas nos cursos oficiais</span>
        </div>
      </footer>
    </div>
  );
}