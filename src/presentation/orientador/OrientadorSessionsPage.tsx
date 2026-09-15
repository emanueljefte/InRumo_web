import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CalendarX,
  Sparkles,
  Search,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import type { OrientationSessionWithNome } from '../../domain/schedule/ScheduleRepository';

type FilterTab = 'todas' | 'marcada' | 'concluida' | 'cancelada';

export default function OrientadorSessionsPage() {
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);

  const [sessions, setSessions] = useState<OrientationSessionWithNome[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleConfirmAction = async () => {
    if (!actionModal) return;
    setIsSubmitting(true);
    try {
      if (actionModal.type === 'cancel') {
        await scheduleRepository.cancelSessionByOrientador(actionModal.sessionId, modalText);
        setSessions((prev) => prev.map((s) => s.id === actionModal.sessionId ? { ...s, estado: 'cancelada' } : s));
      } else {
        await scheduleRepository.concludeSessionWithNotes(actionModal.sessionId, modalText);
        setSessions((prev) => prev.map((s) => s.id === actionModal.sessionId ? { ...s, estado: 'concluida' } : s));
      }
      setActionModal(null);
      setModalText('');
    } catch (error) {
      console.error('Erro ao processar ação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchStatus = activeTab === 'todas' || s.estado === activeTab;
      const matchQuery = (s.matriculadoNome ?? '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [sessions, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      todas: sessions.length,
      marcada: sessions.filter((s) => s.estado === 'marcada').length,
      concluida: sessions.filter((s) => s.estado === 'concluida').length,
      cancelada: sessions.filter((s) => s.estado === 'cancelada').length,
    };
  }, [sessions]);

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
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-10 bg-surface-container-high rounded-2xl w-48" />
        <div className="h-12 bg-surface-container-high rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-container-high rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 font-body">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-muted text-primary text-xs font-bold border border-primary/20 mb-2">
            <Sparkles size={14} />
            <span>Gestão de Agenda</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Sessões de Orientação
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Acompanhe seus horários agendados e registre os atendimentos realizados.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-2.5 rounded-2xl shadow-xs shrink-0 self-start md:self-auto">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-on-surface">
            {counts.marcada} {counts.marcada === 1 ? 'Agendada' : 'Agendadas'}
          </span>
        </div>
      </div>

      {/* Controles de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tabs de Estado */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-2xl border border-outline-variant overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('marcada')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'marcada'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Agendadas ({counts.marcada})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('concluida')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'concluida'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Concluídas ({counts.concluida})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cancelada')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cancelada'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Canceladas ({counts.cancelada})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('todas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'todas'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todas ({counts.todas})
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar estudante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Lista de Sessões */}
      {filteredSessions.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-low text-on-surface-variant border border-outline-variant flex items-center justify-center mx-auto">
            <CalendarX className="w-7 h-7" />
          </div>
          <div className="max-w-xs mx-auto space-y-1">
            <p className="font-heading font-bold text-sm text-on-surface">
              Nenhuma sessão encontrada
            </p>
            <p className="text-xs text-on-surface-variant">
              {searchQuery
                ? 'Nenhum estudante atende aos critérios da busca.'
                : 'Não existem registros para a categoria selecionada.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((s) => {
            return (
              <div
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant hover:border-primary/40 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                {/* Informações da Sessão */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-primary-muted border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                    {getInitials(s.matriculadoNome)}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-xs sm:text-sm text-on-surface truncate">
                        {s.matriculadoNome ?? 'Estudante'}
                      </p>

                      {/* Badges de Estado */}
                      {s.estado === 'marcada' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-muted text-primary border border-primary/20">
                          <Clock size={10} /> Agendada
                        </span>
                      )}
                      {s.estado === 'concluida' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-success border border-emerald-200">
                          <CheckCircle2 size={10} /> Concluída
                        </span>
                      )}
                      {s.estado === 'cancelada' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-error border border-red-200">
                          <XCircle size={10} /> Cancelada
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                      <Calendar size={13} className="text-on-surface-variant/70 shrink-0" />
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

                {/* Ações por Linha */}
                <div className="flex items-center justify-end border-t sm:border-t-0 border-outline-variant/60 pt-3 sm:pt-0 shrink-0">
                  {s.estado === 'marcada' && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setActionModal({ type: 'cancel', sessionId: s.id })}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl border border-outline-variant hover:border-error/30 hover:bg-red-50 text-on-surface-variant hover:text-error text-xs font-semibold transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => setActionModal({ type: 'conclude', sessionId: s.id })}
                        className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-on-primary text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        Concluir
                      </button>
                    </div>
                  )}

                  {s.estado === 'concluida' && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-success font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 size={14} />
                      <span>Atendimento Realizado</span>
                    </div>
                  )}

                  {s.estado === 'cancelada' && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-error font-medium px-3 py-1 rounded-xl bg-red-50 border border-red-100">
                      <AlertCircle size={13} />
                      <span>Sessão Cancelada</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Ação */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-outline-variant">
            <div>
              <h3 className="font-heading text-base font-bold text-on-surface">
                {actionModal.type === 'cancel' ? 'Cancelar Sessão' : 'Concluir Sessão'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {actionModal.type === 'cancel'
                  ? 'Informe o motivo do cancelamento para o estudante.'
                  : 'Adicione observações finais referentes a este atendimento.'}
              </p>
            </div>

            <textarea
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder={
                actionModal.type === 'cancel'
                  ? 'Descreva o motivo (obrigatório)...'
                  : 'Notas da sessão (opcional)...'
              }
              className="w-full border border-outline-variant rounded-xl p-3 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-24 resize-none bg-surface-container-lowest"
            />

            <div className="flex items-center gap-2 justify-end pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setActionModal(null);
                  setModalText('');
                }}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={isSubmitting || (actionModal.type === 'cancel' && !modalText.trim())}
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-xs font-semibold text-on-primary rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                  actionModal.type === 'cancel'
                    ? 'bg-error hover:opacity-90'
                    : 'bg-primary hover:opacity-90'
                }`}
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}