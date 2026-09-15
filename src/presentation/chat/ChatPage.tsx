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
  Zap,
} from 'lucide-react';
import { useChat } from '../../application/chat/useChat';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';
import { useNavigate } from 'react-router-dom';
import { formatAttachmentMessage, parseAttachmentMessage } from '../../application/chat/attachmentHelpers';
import { SupabaseDocumentRepository } from '../../data/supabase/SupabaseDocumentRepository';
import { useAuth } from '../../application/auth/useAuth';
import type { Message } from '../../domain/chat/Chat';

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
  const isOrientador = senderRole === 'orientador';

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-90px)] sm:h-[calc(100vh-110px)] bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden font-sans text-slate-800 antialiased relative">
      
      {/* 1. CABEÇALHO CLARO */}
      <header className="p-4 px-6 flex items-center justify-between bg-slate-50/80 backdrop-blur-md border-b border-slate-200/80 shrink-0 z-20 sticky top-0 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all shadow-xs ring-1 ${
                isHumanAgent
                  ? 'bg-amber-100 text-amber-700 ring-amber-300'
                  : 'bg-indigo-100 text-indigo-700 ring-indigo-200'
              }`}
            >
              {isHumanAgent ? <UserCheck size={22} /> : <Bot size={22} />}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                isHumanAgent ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm sm:text-base text-slate-900 tracking-tight">
                {isOrientador && studentNome ? studentNome : 'Orientador Vocacional'}
              </h1>
              <HeaderStatusBadge isHumanAgent={isHumanAgent} />
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
              {isHumanAgent ? (
                <span className="text-amber-700 flex items-center gap-1">
                  <Clock size={11} /> Sessão em direto com especialista
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1">
                  <Zap size={11} className="text-indigo-600" /> Respostas imediatas e personalizadas
                </span>
              )}
            </p>
          </div>
        </div>

        <HeaderActions
          isOrientador={isOrientador}
          allowEscalation={allowEscalation}
          isHumanAgent={isHumanAgent}
          escalating={escalating}
          escalated={escalated}
          onEscalate={handleEscalate}
        />
      </header>

      {/* BANNER DE ESPERA PARA O ESTUDANTE */}
      {!isOrientador && isHumanAgent && messages.length > 0 && messages[messages.length - 1].sender !== 'orientador' && (
        <div className="bg-amber-50 border-b border-amber-200 text-center py-2.5 px-4 shrink-0 animate-fadeIn">
          <span className="text-xs text-amber-800 font-medium flex items-center justify-center gap-2">
            <Clock size={14} className="animate-spin text-amber-600" /> 
            Um orientador responderá em breve. Podes continuar a escrever as tuas dúvidas.
          </span>
        </div>
      )}

      {/* 2. ÁREA DE MENSAGENS */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 scroll-smooth">
        {messages.length === 0 ? (
          <EmptyChatState onSelectPrompt={handleSend} />
        ) : (
          messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              msg={msg}
              senderRole={senderRole}
              documentRepository={documentRepository}
            />
          ))
        )}

        {sending && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* 3. RODAPÉ E CAMPO DE ENTRADA */}
      <footer className="p-4 bg-white shrink-0 z-20 border-t border-slate-200 space-y-3">
        {error && <p className="text-xs text-rose-600 font-medium text-center">{error}</p>}

        {isOrientador && isHumanAgent && chat?.id && (
          <OrientadorBar
            chatId={chat.id}
            onCloseChat={async () => {
              await chatRepository.closeChat(chat.id);
              navigate('/orientador/chats');
            }}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl p-2 transition-all duration-200">
            <input
              type="file"
              id="chat-file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUploadDocument(e.target.files[0])}
            />
            <label
              htmlFor="chat-file"
              className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 rounded-xl cursor-pointer transition-all shrink-0 active:scale-95"
              title="Anexar documento"
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
              className="w-full bg-transparent py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 font-normal"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all duration-200 shrink-0 cursor-pointer flex items-center justify-center shadow-md shadow-indigo-600/20 active:scale-95"
              aria-label="Enviar"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-medium">
          <span className="hidden sm:inline-flex items-center gap-1">
            Prime <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9px] text-slate-600">Enter</kbd> para enviar
          </span>
          <span className="ml-auto flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-600" /> Respostas validadas
          </span>
        </div>
      </footer>
    </div>
  );
}

{/* --- COMPONENTES AUXILIARES CLAROS --- */}

function HeaderStatusBadge({ isHumanAgent }: { isHumanAgent: boolean }) {
  if (isHumanAgent) {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
        Humano
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
      <Sparkles size={10} className="text-indigo-600 animate-pulse" /> IA Ativa
    </span>
  );
}

function HeaderActions({
  isOrientador,
  allowEscalation,
  isHumanAgent,
  escalating,
  escalated,
  onEscalate,
}: {
  isOrientador: boolean;
  allowEscalation: boolean;
  isHumanAgent: boolean;
  escalating: boolean;
  escalated: boolean;
  onEscalate: () => void;
}) {
  if (isOrientador) return null;

  return (
    <div className="flex items-center gap-2">
      {allowEscalation && !isHumanAgent && (
        <button
          type="button"
          onClick={onEscalate}
          disabled={escalating}
          className="group text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
        >
          {escalating ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
          <span className="hidden sm:inline">Falar com Orientador</span>
          <span className="sm:hidden">Humano</span>
        </button>
      )}

      {escalated && (
        <span className="text-xs text-amber-800 font-semibold animate-pulse bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
          Pedido enviado!
        </span>
      )}
    </div>
  );
}

function EmptyChatState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="text-center py-12 sm:py-16 space-y-6 max-w-lg mx-auto my-auto">
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto shadow-md shadow-indigo-100">
          <Sparkles size={36} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Como posso ajudar a orientar o teu futuro?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          Explora cursos, tira dúvidas sobre notas de corte ou pede ajuda para escolher o teu percurso.
        </p>
      </div>

      <div className="space-y-3 pt-3 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
          <HelpCircle size={13} className="text-indigo-600" /> Dúvidas frequentes:
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="group text-left text-xs bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl p-3.5 text-slate-700 hover:text-indigo-900 shadow-2xs transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-98"
            >
              <span className="font-medium pr-2 leading-snug">{prompt}</span>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} className="text-emerald-600" /> Informação oficial
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <MessageSquare size={13} className="text-indigo-600" /> Apoio contínuo
        </span>
      </div>
    </div>
  );
}

function ChatMessageBubble({
  msg,
  documentRepository,
}: {
  msg: Message;
  senderRole: 'user' | 'orientador';
  documentRepository: SupabaseDocumentRepository;
}) {
  const isUser = msg.sender === 'user';
  const isOrientador = msg.sender === 'orientador';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {!isUser && (
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs border ${
            isOrientador
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}
        >
          {isOrientador ? <User size={16} /> : <Bot size={16} />}
        </div>
      )}

      <div
        className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed break-words shadow-2xs transition-all border ${
          isUser
            ? 'bg-indigo-600 text-white border-indigo-700 rounded-br-xs font-normal'
            : isOrientador
            ? 'bg-amber-50/90 text-amber-950 border-amber-200 rounded-bl-xs'
            : 'bg-white text-slate-800 border-slate-200/80 rounded-bl-xs'
        }`}
      >
        {!isUser && (
          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 border-b border-slate-100 pb-1">
            {isOrientador ? 'Orientador Humano' : 'Assistente IA'}
          </span>
        )}

        {(() => {
          const attachment = parseAttachmentMessage(msg.content);
          if (attachment) {
            return (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 my-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <FileText className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="truncate text-xs font-medium text-slate-700">{attachment.fileName}</span>
                </div>
                <button
                  onClick={async () => {
                    const url = await documentRepository.getDownloadUrl(attachment.filePath);
                    window.open(url, '_blank');
                  }}
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors shrink-0 text-slate-500 hover:text-indigo-600"
                  title="Descarregar documento"
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
            className={`block text-[9px] mt-1.5 text-right font-medium opacity-60 ${
              isUser ? 'text-indigo-100' : 'text-slate-400'
            }`}
          >
            {new Date(msg.createdAt).toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-xs">
          <User size={16} />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start gap-3 animate-fadeIn">
      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
        <Bot size={16} />
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

function OrientadorBar({ onCloseChat }: { chatId: string; onCloseChat: () => void }) {
  return (
    <div className="flex justify-end pb-1">
      <button
        type="button"
        onClick={onCloseChat}
        className="text-xs font-medium text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
      >
        <XCircle size={14} /> Encerrar sessão
      </button>
    </div>
  );
}