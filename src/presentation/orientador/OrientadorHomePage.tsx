import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseChatRepository } from '../../data/supabase/SupabaseChatRepository';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';

export default function OrientadorHomePage() {
  const navigate = useNavigate();
  const { profile, session } = useAuth();
  const chatRepository = useMemo(() => new SupabaseChatRepository(), []);
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);
  const [chatCount, setChatCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      chatRepository.getEscalatedChats(),
      scheduleRepository.getSessionsForOrientador(session.user.id),
    ]).then(([chats, sessions]) => {
      setChatCount(chats.length);
      setSessionCount(sessions.filter((s) => s.estado === 'marcada').length);
      setLoading(false);
    });
  }, [session, chatRepository, scheduleRepository]);

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-heading text-3xl font-bold text-on-surface">Olá, {profile?.nome}!</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <button onClick={() => navigate('/orientador/chats')} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 text-left hover:border-tertiary transition-all">
          <MessageCircle className="w-6 h-6 text-tertiary mb-3" />
          <p className="font-heading text-2xl font-bold text-on-surface">{chatCount}</p>
          <p className="font-body-sm text-on-surface-variant">Conversas escaladas</p>
        </button>
        <button onClick={() => navigate('/orientador/sessions')} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 text-left hover:border-tertiary transition-all">
          <Calendar className="w-6 h-6 text-tertiary mb-3" />
          <p className="font-heading text-2xl font-bold text-on-surface">{sessionCount}</p>
          <p className="font-body-sm text-on-surface-variant">Sessões marcadas</p>
        </button>
      </div>
    </div>
  );
}