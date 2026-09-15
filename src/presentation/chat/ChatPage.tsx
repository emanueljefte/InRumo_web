import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
  FileText,
  Download,
  Paperclip,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { useChat } from '../../application/chat/useChat';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';
import { useNavigate } from 'react-router-dom';
import { formatAttachmentMessage, parseAttachmentMessage } from '../../application/chat/attachmentHelpers';
import { SupabaseDocumentRepository } from '../../data/supabase/SupabaseDocumentRepository';
import { useAuth } from '../../application/auth/useAuth';

interface ChatPageProps {
  allowEscalation: boolean;
  chatId?: string;
  senderRole?: 'user' | 'orientador';
  studentNome?: string;
}

const chatRepository = new SupabaseChatRepository();

const QUICK_PROMPTS = [
  'Quais são os cursos disponíveis?',
  'Como posso agendar uma sessão individual?',
];

export default function ChatPage({
  allowEscalation,
  chatId,
  senderRole = 'user',
  studentNome,
}: ChatPageProps) {
  const { chat, messages, sendMessage, escalate, error } = useChat(chatRepository, chatId);
  const { session } = useAuth();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const documentRepository = useMemo(() => new SupabaseDocumentRepository(), []);

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

  const handleUploadDocument = async (file: File) => {
    if (!chat || !session) return;
    try {
      setSending(true);
      const filePath = await documentRepository.uploadChatDocument(chat.id, session.user.id, file);
      await sendMessage(formatAttachmentMessage(filePath, file.name), senderRole);
    } catch (err) {
      console.error('Erro ao carregar documento:', err);
    } finally {
      setSending(false);
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
      setEscalated(true);
      setTimeout(() => setEscalated(false), 4000);
    } catch (err) {
      console.error('Erro ao transferir para humano:', err);
    } finally {
      setEscalating(false);
    }
  };

  const isHumanAgent = chat?.status === 'escalated';

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 sm:rounded-3xl shadow-2xl overflow-hidden font-body text-on-surface antialiased relative">
      
      {/* 1. CABEÇALHO COM EFEITO GLASSMORPHISM */}
      <header className="p-4 px-5 sm:px-7 flex items-center justify-between bg-surface-container-lowest/70 backdrop-blur-md border-b border-outline-variant/20 shrink-0 z-20 sticky top-0 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all shadow-inner ${
                isHumanAgent
                  ? 'bg-gradient-to-br from-tertiary/20 to-tertiary/5 text-tertiary border border-tertiary/30'
                  : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/30'
              }`}
            >
              {isHumanAgent ? <UserCheck size={22} /> : <Bot size={22} />}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-surface-container-lowest animate-pulse ${
                isHumanAgent ? 'bg-tertiary' : 'bg-emerald-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-sm sm:text-base font-bold text-on-surface tracking-tight">
                {senderRole === 'orientador' && studentNome ? studentNome : 'Orientador Vocacional'}
              </h1>
              {isHumanAgent ? (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/30 px-2 py-0.5 rounded-full shadow-2xs">
                  Humano
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Sparkles size={10} className="animate-spin" /> IA Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-on-surface-variant/80 mt-0.5 flex items-center gap-1 font-medium">
              {isHumanAgent ? (
                <span className="text-tertiary">Sessão em direto com especialista</span>
              ) : (
                <span>Respostas imediatas e personalizadas</span>
              )}
            </p>
          </div>
        </div>

        {/* Ações do Cabeçalho */}
        <div className="flex items-center gap-2">
          {allowEscalation && !isHumanAgent && (
            <button
              type="button"
              onClick={handleEscalate}
              disabled={escalating}
              className="group text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-on-primary border border-primary/30 px-4 py-2.5 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              {escalating ? <Loader2 size={15} className="animate-spin" /> : <UserCheck size={15} />}
              <span className="hidden sm:inline">Falar com Humano</span>
              <span className="sm:hidden">Humano</span>
            </button>
          )}

          {escalated && (
            <span className="text-xs text-primary font-bold animate-bounce bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Pedido enviado!
            </span>
          )}
        </div>
      </header>

      {/* BANNER PARA ATENDIMENTO HUMANO */}
      {isHumanAgent && messages.length > 0 && messages[messages.length - 1].sender !== 'orientador' && (
        <div className="bg-tertiary-container/30 border-b border-tertiary/20 text-center py-2.5 px-4 shrink-0 backdrop-blur-sm animate-fadeIn">
          <span className="text-xs text-on-tertiary-container font-semibold flex items-center justify-center gap-1.5">
            <Clock size={13} className="animate-spin" /> Um orientador responderá em breve. Podes continuar a escrever.
          </span>
        </div>
      )}

      {/* 2. ÁREA DE MENSAGENS COM BACKGROUND DINÂMICO */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-surface-container-low/30 via-transparent to-surface-container-low/20 scroll-smooth">
        {messages.length === 0 ? (
          /* ESTADO VAZIO */
          <div className="text-center py-10 sm:py-14 space-y-6 max-w-lg mx-auto my-auto animate-fadeIn">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-lg shadow-primary/5">
                <Sparkles size={38} className="text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-black text-on-surface tracking-tight">
                Como posso guiar o teu futuro hoje?
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed max-w-sm mx-auto">
                Pergunta sobre cursos, notas de corte, saídas profissionais ou pede orientações de carreira.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex items-center gap-1.5 px-1">
                <HelpCircle size={13} className="text-primary" /> Sugestões de conversa:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="group text-left text-xs bg-surface-container-lowest/80 hover:bg-primary-container/20 border border-outline-variant/30 hover:border-primary/50 rounded-2xl p-4 text-on-surface shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer active:scale-98"
                  >
                    <span className="font-medium pr-2 group-hover:text-primary transition-colors leading-snug">
                      {prompt}
                    </span>
                    <ArrowRight size={14} className="text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex items-center justify-center gap-4 text-[11px] text-on-surface-variant/60 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-primary" /> Proteção de dados
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MessageSquare size={13} className="text-primary" /> Canal Oficial
              </span>
            </div>
          </div>
        ) : (
          /* BALÕES DE MENSAGENS */
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
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-sm border ${
                      isOrientador
                        ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/30'
                        : 'bg-primary-container text-on-primary-container border-primary/30'
                    }`}
                  >
                    {isOrientador ? <User size={18} /> : <Bot size={18} />}
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[75%] rounded-3xl px-4 sm:px-5 py-3.5 text-xs sm:text-sm leading-relaxed break-words shadow-sm transition-all border ${
                    isUser
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-on-primary border-primary/80 rounded-br-xs font-medium shadow-primary/10'
                      : isOrientador
                      ? 'bg-tertiary-container/40 text-on-tertiary-container border-tertiary/30 rounded-bl-xs backdrop-blur-xs'
                      : 'bg-surface-container-lowest/90 text-on-surface border-outline-variant/30 rounded-bl-xs backdrop-blur-xs'
                  }`}
                >
                  {!isUser && (
                    <span className="block text-[10px] font-black uppercase tracking-wider opacity-60 mb-1 border-b border-current/10 pb-1">
                      {isOrientador ? 'Orientador Humano' : 'Assistente AI'}
                    </span>
                  )}

                  {(() => {
                    const attachment = parseAttachmentMessage(msg.content);
                    if (attachment) {
                      return (
                        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-container-high/40 border border-current/15 my-1">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                              <FileText className="w-4 h-4 shrink-0" />
                            </div>
                            <span className="truncate text-xs font-semibold">{attachment.fileName}</span>
                          </div>
                          <button
                            onClick={async () => {
                              const url = await documentRepository.getDownloadUrl(attachment.filePath);
                              window.open(url, '_blank');
                            }}
                            className="p-2 hover:bg-primary/20 rounded-xl transition-colors shrink-0 text-primary"
                            title="Descarregar ficheiro"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    }
                    return <p className="whitespace-pre-wrap">{msg.content}</p>;
                  })()}

                  {msg.createdAt && (
                    <span
                      className={`block text-[10px] mt-2 text-right opacity-60 flex items-center justify-end gap-1 font-medium ${
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
                  <div className="w-9 h-9 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-md shadow-primary/20">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* INDICADOR DE DIGITAÇÃO */}
        {sending && (
          <div className="flex justify-start gap-3 animate-fadeIn">
            <div className="w-9 h-9 rounded-2xl bg-primary-container text-on-primary-container border border-primary/30 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
              <Bot size={18} />
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl rounded-bl-xs px-5 py-4 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 3. CAIXA DE ENTRADA / FLOATING FOOTER */}
      <footer className="p-4 bg-surface-container-lowest/80 backdrop-blur-md shrink-0 z-20 border-t border-outline-variant/20 space-y-2">
        {error && <p className="font-body-sm text-xs text-error font-medium text-center">{error}</p>}

        {/* BARRA DE ENCERRAMENTO PARA O ORIENTADOR */}
        {senderRole === 'orientador' && chat?.status === 'escalated' && (
          <div className="flex justify-end pb-1">
            <button
              type="button"
              onClick={async () => {
                await chatRepository.closeChat(chat.id);
                navigate('/orientador/chats');
              }}
              className="text-xs font-semibold text-error hover:bg-error/10 px-3.5 py-1.5 rounded-xl border border-error/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <XCircle size={14} /> Encerrar conversa
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* CAIXA DE ENTRADA COM EFEITO DE FOCO */}
          <div className="flex items-center gap-2 bg-surface-container-low/80 hover:bg-surface-container-low border border-outline-variant/30 focus-within:border-primary focus-within:bg-surface-container-lowest focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl px-3 py-2 transition-all duration-300 shadow-2xs">
            <input
              type="file"
              id="chat-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUploadDocument(e.target.files[0])}
            />
            <label
              htmlFor="chat-file"
              className="p-2 text-on-surface-variant/70 hover:text-primary hover:bg-primary/10 rounded-xl cursor-pointer transition-all shrink-0"
              title="Anexar ficheiro"
            >
              <Paperclip className="w-4 h-4" />
            </label>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreve a tua mensagem..."
              disabled={sending}
              className="w-full bg-transparent py-1.5 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none disabled:opacity-50 font-medium"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-on-primary p-2.5 rounded-xl disabled:opacity-20 transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center shadow-md shadow-primary/20 active:scale-95"
              aria-label="Enviar"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between px-2 text-[10px] text-on-surface-variant/60 font-medium">
          <span className="hidden sm:inline-flex items-center gap-1">
            Prime <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 font-mono text-[9px]">Enter</kbd> para enviar
          </span>
          <span className="ml-auto">Respostas baseadas nos cursos oficiais</span>
        </div>
      </footer>
    </div>
  );
}