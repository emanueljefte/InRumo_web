import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Clock, ArrowRight, Inbox, Sparkles, } from 'lucide-react';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';
import type { EscalatedChat } from '../../domain/schedule/ChatModeration';

export default function OrientadorChatsPage() {
    const navigate = useNavigate();
    const chatRepository = useMemo(() => new SupabaseChatRepository(), []);

    const [chats, setChats] = useState<EscalatedChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        chatRepository.getEscalatedChats()
            .then((c) => setChats(c))
            .finally(() => setLoading(false));
    }, [chatRepository]);

    // Filtro de conversas por nome do estudante ou última mensagem
    const filteredChats = useMemo(() => {
        return chats.filter((chat) => {
            const query = searchQuery.toLowerCase();
            const matchName = chat.userNome?.toLowerCase().includes(query);
            const matchMsg = chat.lastMessage?.toLowerCase().includes(query);
            return matchName || matchMsg;
        });
    }, [chats, searchQuery]);

    // Função auxiliar para obter as iniciais do estudante
    const getInitials = (name?: string) => {
        if (!name) return 'E';
        return name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    // Função para formatar o horário de maneira amigável
    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();

        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                <div className="h-10 bg-surface-container-high/60 rounded-2xl w-48" />
                <div className="h-12 bg-surface-container-high/60 rounded-2xl" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-surface-container-high/60 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* ================= CABEÇALHO E MÉTTRICAS ================= */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20 mb-2">
                        <Sparkles size={14} />
                        <span>Fila de Suporte Vocacional</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                        Conversas Escaladas
                    </h1>
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                        Atendimentos direcionados ao orientador após a triagem inicial do chatbot.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 rounded-2xl shrink-0 self-start md:self-auto">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-on-surface">
                        {chats.length} {chats.length === 1 ? 'Pendente' : 'Pendentes'}
                    </span>
                </div>
            </div>

            {/* ================= BARRA DE PESQUISA ================= */}
            {chats.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome do estudante ou conteúdo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/60 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant hover:text-on-surface px-2 py-1 rounded-lg bg-surface-container-high"
                        >
                            Limpar
                        </button>
                    )}
                </div>
            )}

            {/* ================= LISTA DE CONVERSAS ================= */}
            {filteredChats.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Inbox className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs mx-auto space-y-1">
                        <p className="font-heading font-bold text-base text-on-surface">
                            {searchQuery ? 'Nenhum resultado encontrado' : 'Tudo em dia por aqui!'}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                            {searchQuery
                                ? 'Tente buscar com termos diferentes.'
                                : 'Não há conversas escaladas que precisem da sua atenção no momento.'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => navigate(`/orientador/chats/${chat.id}`)}
                            className="group w-full flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-left cursor-pointer relative overflow-hidden"
                        >
                            {/* Indicador lateral de hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Avatar com as iniciais do aluno */}
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shrink-0 group-hover:scale-105 transition-transform">
                                {getInitials(chat.userNome)}
                            </div>

                            {/* Informações da conversa */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="font-heading font-bold text-sm sm:text-base text-on-surface truncate">
                                        {chat.userNome ?? 'Estudante'}
                                    </p>

                                    {/* Data/Horário */}
                                    {chat.updatedAt && (
                                        <span className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1 shrink-0">
                                            <Clock size={12} />
                                            {formatTime(chat.updatedAt)}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-on-surface-variant truncate font-normal">
                                    {chat.lastMessage || 'Sem mensagens recentes.'}
                                </p>
                            </div>

                            {/* Ícone de Ação / Seta */}
                            <div className="p-2 rounded-xl bg-surface-container-low group-hover:bg-primary group-hover:text-on-primary transition-colors text-on-surface-variant shrink-0">
                                <ArrowRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}