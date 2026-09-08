import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';
import type { EscalatedChat } from '../../domain/schedule/ChatModeration';

export default function OrientadorChatsPage() {
    const navigate = useNavigate();
    const chatRepository = useMemo(() => new SupabaseChatRepository(), []);
    const [chats, setChats] = useState<EscalatedChat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        chatRepository.getEscalatedChats().then((c) => {
            setChats(c);
            setLoading(false);
        });
    }, [chatRepository]);

    if (loading) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="font-heading text-headline-lg text-on-surface">Conversas Escaladas</h1>

            {chats.length === 0 ? (
                <p className="font-body-sm text-on-surface-variant text-center py-12">Sem conversas escaladas no momento.</p>
            ) : (
                <div className="space-y-3">
                    {chats.map((chat) => (
                        <button key={chat.id} onClick={() => navigate(`/orientador/chats/${chat.id}`)}
                            className="w-full flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 hover:border-tertiary transition-all text-left">
                            <div className="w-10 h-10 rounded-full bg-tertiary-container/50 flex items-center justify-center text-tertiary shrink-0">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-body-sm font-medium text-on-surface">{chat.userNome}</p>
                                <p className="font-body-sm text-xs text-on-surface-variant truncate">{chat.lastMessage}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}