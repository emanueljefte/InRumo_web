import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCircle2, 
  Bot, 
  Bell 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'orientador';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  isAI?: boolean;
  roleBadge?: string;
  isOnline?: boolean;
  lastMessage: string;
  lastTime: string;
  unreadCount?: number;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Ricardo Silva',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    roleBadge: 'ORIENTADOR CERTIFICADO',
    isOnline: true,
    lastMessage: 'Claro, podemos rever as opções ...',
    lastTime: '14:30',
  },
  {
    id: '2',
    name: 'InRumo AI Assistente',
    avatar: '',
    isAI: true,
    lastMessage: 'Os teus resultados do teste de p...',
    lastTime: 'Ontem',
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'user',
    text: 'Boa tarde Dr. Ricardo, estive a ver os resultados do teste e fiquei um pouco confusa com a forte inclinação para as engenhariais, visto que sempre gostei mais de humanidades.',
    time: '14:20',
  },
  {
    id: 'm2',
    sender: 'orientador',
    text: 'Olá Maria! É muito comum haver surpresas nestes testes. O teste avaliou as tuas competências analíticas e de resolução de problemas, que pontuaram muito alto.\n\nIsto não invalida o teu gosto por humanidades. Aliás, áreas como Design de Interação ou Arquitetura misturam muito bem essas duas vertentes.',
    time: '14:25',
  },
  {
    id: 'm3',
    sender: 'user',
    text: 'Isso faz sentido. Acha que podíamos falar um pouco mais sobre essas áreas de interseção na nossa próxima sessão?',
    time: '14:28',
  },
  {
    id: 'm4',
    sender: 'orientador',
    text: 'Claro, podemos rever as opções de mestrado amanhã. Vou preparar alguns exemplos concretos de planos de estudo para analisarmos juntos.',
    time: '14:30',
  },
];

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState<string>('');

  const activeConversation = CONVERSATIONS.find((c) => c.id === activeChatId) || CONVERSATIONS[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col font-sans text-[#1a1b22] antialiased -m-6 sm:-m-8 md:-m-10">
      
      {/* Área Superior do Titulo da Seção no Chat */}
      <div className="bg-[#fbf8ff] border-b border-[#e8e7f1] px-6 py-4 flex items-center justify-between shrink-0">
        <h1 className="font-heading text-xl font-bold text-[#7e5700]">
          Mensagens
        </h1>
        <button 
          type="button"
          className="p-2 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c9932e] rounded-full" />
        </button>
      </div>

      {/* Grid de Chat (Esquerda: Conversas, Direita: Mensagens Ativas) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LADO ESQUERDO: LISTA DE CONVERSAS */}
        <aside className="w-80 md:w-96 border-r border-[#e8e7f1] bg-[#fbf8ff] flex flex-col shrink-0">
          
          {/* Pesquisa de Conversas */}
          <div className="p-4 border-b border-[#e8e7f1]/60">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#827564]" />
              <input
                type="text"
                placeholder="Procurar conversa..."
                className="w-full bg-[#eeedf7]/60 focus:bg-white text-xs text-[#1a1b22] placeholder:text-[#827564] pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-[#7e5700] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Lista de Chats */}
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {CONVERSATIONS.map((chat) => {
              const isActive = chat.id === activeChatId;

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 relative ${
                    isActive
                      ? 'bg-white border border-[#e8e7f1] shadow-2xs'
                      : 'hover:bg-[#eeedf7]/50'
                  }`}
                >
                  {/* Borda indicador ativa */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#7e5700] rounded-r-full" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {chat.isAI ? (
                      <div className="w-11 h-11 rounded-full bg-[#c9932e] text-white flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                    ) : (
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#e8e7f1]"
                      />
                    )}
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Detalhes da conversa */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-xs font-bold text-[#1a1b22] truncate">
                        {chat.name}
                      </h3>
                      <span className="text-[10px] text-[#827564] font-medium">
                        {chat.lastTime}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#827564] truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Perfil do Estudante no Rodapé Lateral */}
          <div className="p-4 border-t border-[#e8e7f1] bg-[#fbf8ff] flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
              alt="Maria Santos"
              className="w-10 h-10 rounded-full object-cover border border-[#e8e7f1]"
            />
            <div className="flex flex-col">
              <span className="font-heading text-xs font-bold text-[#1a1b22]">
                Maria Santos
              </span>
              <span className="text-[11px] text-[#827564]">Estudante</span>
            </div>
          </div>

        </aside>

        {/* LADO DIREITO: JANELA DA CONVERSA */}
        <section className="flex-1 flex flex-col bg-[#f4f2fd]/40">
          
          {/* Header da Conversa Ativa */}
          <div className="p-4 sm:px-6 bg-white border-b border-[#e8e7f1] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#e8e7f1]"
                />
                {activeConversation.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-heading text-sm font-bold text-[#1a1b22]">
                    {activeConversation.name}
                  </h2>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7e5700]" />
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                  </span>
                  {activeConversation.roleBadge && (
                    <span className="text-[9px] font-bold tracking-wider uppercase bg-[#fbf5e8] text-[#7e5700] px-2 py-0.5 rounded-md border border-[#d4c4b0]/40">
                      {activeConversation.roleBadge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="text-[#827564] hover:text-[#1a1b22] p-1.5 rounded-lg hover:bg-[#f4f2fd] transition-colors"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          {/* Área do Histórico de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Divisor de Data */}
            <div className="flex items-center justify-center">
              <span className="bg-[#eeedf7] text-[#827564] text-[11px] font-semibold px-3 py-1 rounded-full">
                Hoje, 14:15
              </span>
            </div>

            {/* Balões de Mensagem */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <img
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[80%] sm:max-w-[65%] p-4 rounded-3xl space-y-1 ${
                      isUser
                        ? 'bg-[#7e5700] text-white rounded-br-xs'
                        : 'bg-white border border-[#e8e7f1] text-[#1a1b22] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p className="font-body text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </p>
                    <div
                      className={`text-[10px] text-right ${
                        isUser ? 'text-white/70' : 'text-[#827564]'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input de Envio de Mensagem */}
          <div className="p-4 bg-white border-t border-[#e8e7f1] shrink-0">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="flex items-center gap-2 bg-[#f4f2fd]/80 rounded-2xl p-2 border border-transparent focus-within:border-[#7e5700] focus-within:bg-white transition-all">
                
                <button
                  type="button"
                  className="p-2 text-[#827564] hover:text-[#1a1b22] rounded-xl hover:bg-[#eeedf7] transition-colors"
                >
                  <Paperclip size={18} />
                </button>

                <input
                  type="text"
                  placeholder="Escreva a sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-[#1a1b22] placeholder:text-[#827564] focus:outline-none px-2"
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-[#7e5700] hover:bg-[#604100] disabled:bg-[#827564]/30 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-all shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>

              <p className="text-[10px] text-[#827564] text-center font-medium">
                As mensagens são protegidas e confidenciais no âmbito da orientação.
              </p>
            </form>
          </div>

        </section>

      </div>

    </div>
  );
}