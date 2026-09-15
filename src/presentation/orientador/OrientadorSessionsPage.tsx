import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CalendarX,
  Sparkles,
  Search
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import type { OrientationSessionWithNome } from '../../domain/schedule/ScheduleRepository';

type FilterTab = 'todas' | 'marcada' | 'concluida';

export default function OrientadorSessionsPage() {
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);

  const [sessions, setSessions] = useState<OrientationSessionWithNome[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('marcada');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionModal, setActionModal] = useState<{ type: 'cancel' | 'conclude'; sessionId: string } | null>(null);
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    if (!session) return;
    scheduleRepository.getSessionsForOrientador(session.user.id)
      .then((s) => setSessions(s))
      .finally(() => setLoading(false));
  }, [session, scheduleRepository]);

  const handleConclude = async (id: string) => {
    setActionLoadingId(id);
    try {
      await scheduleRepository.concludeSession(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: 'concluida' } : s))
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!actionModal) return;
    if (actionModal.type === 'cancel') {
      await scheduleRepository.cancelSessionByOrientador(actionModal.sessionId, modalText);
      setSessions((prev) => prev.map((s) => s.id === actionModal.sessionId ? { ...s, estado: 'cancelada' } : s));
    } else {
      await scheduleRepository.concludeSessionWithNotes(actionModal.sessionId, modalText);
      setSessions((prev) => prev.map((s) => s.id === actionModal.sessionId ? { ...s, estado: 'concluida' } : s));
    }
    setActionModal(null);
    setModalText('');
  };

  // Filtros aplicados
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchStatus = activeTab === 'todas' || s.estado === activeTab;
      const matchQuery = s.matriculadoNome
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [sessions, activeTab, searchQuery]);

  // Contadores para as abas
  const counts = useMemo(() => {
    return {
      todas: sessions.length,
      marcada: sessions.filter((s) => s.estado === 'marcada').length,
      concluida: sessions.filter((s) => s.estado === 'concluida').length,
    };
  }, [sessions]);

  // Auxiliar para iniciais
  const getInitials = (name?: string) => {
    if (!name) return 'E';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-surface-container-high/60 rounded-2xl w-48" />
        <div className="h-12 bg-surface-container-high/60 rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-container-high/60 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ================= CABEÇALHO ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20 mb-2">
            <Sparkles size={14} />
            <span>Gestão de Agenda</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Sessões de Orientação
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Acompanhe seus horários agendados e marque os atendimentos concluídos.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 rounded-2xl shrink-0 self-start md:self-auto">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-on-surface">
            {counts.marcada} {counts.marcada === 1 ? 'Agendada' : 'Agendadas'}
          </span>
        </div>
      </div>

      {/* ================= CONTROLES E ABAS DE FILTRO ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

        {/* Abas de Navegação */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-2xl border border-outline-variant/40 shrink-0">
          <button
            onClick={() => setActiveTab('marcada')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'marcada'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
          >
            Agendadas ({counts.marcada})
          </button>
          <button
            onClick={() => setActiveTab('concluida')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'concluida'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
          >
            Concluídas ({counts.concluida})
          </button>
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'todas'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
          >
            Todas ({counts.todas})
          </button>
        </div>

        {/* Busca por Nome */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar estudante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/60 transition-all"
          />
        </div>
      </div>

      {/* ================= LISTA DE SESSÕES ================= */}
      {filteredSessions.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CalendarX className="w-8 h-8" />
          </div>
          <div className="max-w-xs mx-auto space-y-1">
            <p className="font-heading font-bold text-base text-on-surface">
              Nenhuma sessão encontrada
            </p>
            <p className="text-xs text-on-surface-variant">
              {searchQuery
                ? 'Não encontramos nenhum estudante com este nome.'
                : 'Não existem sessões registradas nesta categoria.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((s) => {
            const isPending = s.estado === 'marcada';
            const isProcessing = actionLoadingId === s.id;

            return (
              <div
                key={s.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/40 rounded-3xl p-5 transition-all duration-200 hover:shadow-xs"
              >
                {/* Info do Estudante */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                    {getInitials(s.matriculadoNome)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-sm sm:text-base text-on-surface truncate">
                        {s.matriculadoNome ?? 'Estudante'}
                      </p>

                      {/* Badge de Status */}
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isPending
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          }`}
                      >
                        {isPending ? (
                          <>
                            <Clock size={10} /> Agendada
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={10} /> Concluída
                          </>
                        )}
                      </span>
                    </div>

                    {/* Data e Hora Formatações */}
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                      <Calendar size={13} className="text-primary/70 shrink-0" />
                      <span className="capitalize">
                        {new Date(s.dataHora).toLocaleString('pt-PT', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ação de Conclusão */}
                <div className="flex items-center justify-end border-t sm:border-t-0 border-outline-variant/30 pt-3 sm:pt-0 shrink-0">
                  {isPending ? (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleConclude(s.id)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {s.estado === 'marcada' && (
                        <div className="flex gap-2">
                          <button onClick={() => setActionModal({ type: 'conclude', sessionId: s.id })} className="text-primary text-xs font-semibold">
                            Concluir
                          </button>
                          <button onClick={() => setActionModal({ type: 'cancel', sessionId: s.id })} className="text-error text-xs font-semibold">
                            Cancelar
                          </button>
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10">
                      <CheckCircle2 size={14} />
                      <span>Atendimento Realizado</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {actionModal && (
        <div className="fixed inset-0 z-60 bg-on-surface/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full space-y-4">
            <p className="font-heading text-headline-sm text-on-surface">
              {actionModal.type === 'cancel' ? 'Cancelar sessão' : 'Concluir sessão'}
            </p>
            <textarea
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder={actionModal.type === 'cancel' ? 'Motivo do cancelamento (visível ao estudante)' : 'Notas da sessão (opcional)'}
              required={actionModal.type === 'cancel'}
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm min-h-24"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setActionModal(null)} className="px-4 py-2 text-sm font-medium">Voltar</button>
              <button onClick={handleConfirmAction} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}