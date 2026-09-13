import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar, ArrowRight, Clock, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
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
    ])
      .then(([chats, sessions]) => {
        setChatCount(chats.length);
        setSessionCount(sessions.filter((s) => s.estado === 'marcada').length);
      })
      .finally(() => setLoading(false));
  }, [session, chatRepository, scheduleRepository]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        {/* Skeleton Hero Banner */}
        <div className="h-44 bg-surface-container-high/60 rounded-3xl" />
        
        {/* Skeleton Grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="h-36 bg-surface-container-high/60 rounded-3xl" />
          <div className="h-36 bg-surface-container-high/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  const firstName = profile?.nome?.split(' ')[0] ?? 'Orientador';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* ================= HERO BANNER DE BOAS-VINDAS ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Sparkles size={14} />
              <span>Painel de Controle</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Olá, {firstName}! 👋
            </h1>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Aqui está o resumo das suas atividades e atendimentos pendentes para hoje.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/orientador/chats')}
              className="px-5 py-3 rounded-2xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Atendimentos</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Círculos decorativos de fundo */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ================= CARDS MÉTRICOS INTERATIVOS ================= */}
      <section className="grid sm:grid-cols-2 gap-5">
        
        {/* Card: Conversas Escaladas */}
        <button
          onClick={() => navigate('/orientador/chats')}
          className="group relative bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors flex items-center gap-1">
              Atender <ArrowRight size={14} />
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-heading text-3xl font-bold text-on-surface">
              {chatCount}
            </p>
            <p className="text-sm font-semibold text-on-surface">Conversas Escaladas</p>
            <p className="text-xs text-on-surface-variant">
              Estudantes aguardando resposta direta do orientador
            </p>
          </div>

          {chatCount > 0 && (
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2 text-xs font-semibold text-amber-600">
              <Clock size={14} />
              <span>Requer sua atenção imediata</span>
            </div>
          )}
        </button>

        {/* Card: Sessões Marcadas */}
        <button
          onClick={() => navigate('/orientador/sessions')}
          className="group relative bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors flex items-center gap-1">
              Ver Agenda <ArrowRight size={14} />
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-heading text-3xl font-bold text-on-surface">
              {sessionCount}
            </p>
            <p className="text-sm font-semibold text-on-surface">Sessões Agendadas</p>
            <p className="text-xs text-on-surface-variant">
              Sessões de orientação presencial ou online agendadas
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <CheckCircle2 size={14} />
            <span>Agenda sincronizada</span>
          </div>
        </button>

      </section>

      {/* ================= SEÇÃO DE ATALHOS RÁPIDOS ================= */}
      <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="font-heading font-bold text-lg text-on-surface">
          Ações Rápidas
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/orientador/availability')}
            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high/60 transition-colors text-left border border-outline-variant/30 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-surface-container-lowest text-primary shadow-xs">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Ajustar Disponibilidade</p>
              <p className="text-[11px] text-on-surface-variant">Defina os seus horários para novos agendamentos</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/orientador/chats')}
            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high/60 transition-colors text-left border border-outline-variant/30 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-surface-container-lowest text-primary shadow-xs">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Fila de Triagem</p>
              <p className="text-[11px] text-on-surface-variant">Analise os relatórios vocacionais recebidos</p>
            </div>
          </button>
        </div>
      </section>

    </div>
  );
}