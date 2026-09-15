import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, X, Loader2, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import { getAvailableSlots, type FreeSlot } from '../../application/schedule/getAvailableSlots';
import type { OrientadorInfo, OrientationSession } from '../../domain/schedule/OrientationSession';

export default function SchedulePage() {
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);

  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [orientadores, setOrientadores] = useState<OrientadorInfo[]>([]);
  const [mySessions, setMySessions] = useState<OrientationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<FreeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modo, setModo] = useState<'presencial' | 'online'>('presencial');
  const [local, setLocal] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const userId = session?.user?.id;
    if (typeof userId !== 'string') return;

    const validUserId: string = userId;
    let isMounted = true;

    async function loadData() {
      try {
        const orientadoresList = await scheduleRepository.getOrientadores();
        if (!isMounted) return;
        setOrientadores(orientadoresList);

        const availability = await scheduleRepository.getAvailability();
        const now = new Date();
        const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const existing = await scheduleRepository.getUpcomingSessions(
          orientadoresList.map((o) => o.id),
          now,
          in7days
        );

        if (!isMounted) return;
        setFreeSlots(getAvailableSlots(availability, existing));

        const mine = await scheduleRepository.getSessionsForMatriculado(validUserId);
        if (!isMounted) return;
        setMySessions(mine.filter((s) => s.estado !== 'cancelada'));
      } catch (error) {
        console.error('Erro ao carregar dados do agendamento:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, scheduleRepository]);

  const handleConfirm = async () => {
    const userId = session?.user?.id;
    if (!booking || typeof userId !== 'string') return;

    setIsSubmitting(true);
    setBookingError(null);
    try {
      const newSession = await scheduleRepository.createSession(userId, booking.orientadorId, booking.dataHora.toISOString(), modo, local || undefined);
      setMySessions((prev) => [...prev, newSession]);
      setFreeSlots((prev) => prev.filter((s) => s.dataHora.getTime() !== booking.dataHora.getTime() || s.orientadorId !== booking.orientadorId));
      setBooking(null);
      setModo('presencial');
      setLocal('');
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Não foi possível marcar a sessão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (sessionId: string) => {
    try {
      await scheduleRepository.cancelSession(sessionId);
      setMySessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error('Erro ao cancelar sessão:', error);
    }
  };

  const orientadorNome = (id: string) =>
    orientadores.find((o) => o.id === id)?.nome ?? 'Orientador';

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
          A carregar horários disponíveis...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
          Agendar Orientação
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Escolhe um orientador e marca um horário para acompanhar a tua jornada de carreira.
        </p>
      </div>

      {/* Sessões Já Agendadas */}
      {mySessions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-base sm:text-lg font-bold text-on-surface">
              As tuas sessões marcadas
            </h2>
          </div>

          <div className="space-y-3">
            {mySessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-outline-variant transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-on-surface">
                      {orientadorNome(s.orientadorId)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" /> Marcada
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {new Date(s.dataHora).toLocaleString('pt-PT', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCancel(s.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancelar</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vagas Disponíveis */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            Horários disponíveis nos próximos 7 dias
          </h2>
        </div>

        {freeSlots.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-on-surface-variant/60 mx-auto" />
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
              Neste momento não existem horários livres com orientadores disponíveis. Volta a consultar em breve.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {freeSlots.map((slot) => {
              const slotId = `${slot.orientadorId}-${slot.dataHora.toISOString()}`;
              return (
                <button
                  key={slotId}
                  type="button"
                  onClick={() => setBooking(slot)}
                  className="flex items-center gap-3.5 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-xs sm:text-sm text-on-surface">
                      {orientadorNome(slot.orientadorId)}
                    </p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      {slot.dataHora.toLocaleString('pt-PT', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal de Confirmação */}
      {booking && (
        <div className="fixed inset-0 z-60 bg-on-surface/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full space-y-4">
            <p className="font-heading text-headline-sm text-on-surface">Confirmar marcação?</p>
            <p className="font-body-sm text-on-surface-variant">
              {orientadorNome(booking.orientadorId)} — {booking.dataHora.toLocaleString('pt-PT', { weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            {bookingError && <p className="text-xs text-error">{bookingError}</p>}
            <div className="flex gap-2">
              <button onClick={() => setModo('presencial')} className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${modo === 'presencial' ? 'bg-primary text-white border-primary' : 'border-outline-variant text-on-surface-variant'}`}>
                Presencial
              </button>
              <button onClick={() => setModo('online')} className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${modo === 'online' ? 'bg-primary text-white border-primary' : 'border-outline-variant text-on-surface-variant'}`}>
                Online
              </button>
            </div>

            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder={modo === 'presencial' ? 'Sala (opcional, a confirmar pelo orientador)' : 'Link da reunião (opcional, a confirmar pelo orientador)'}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-xs"
            />

            <div className="flex gap-3 justify-end">
              <button onClick={() => {
                setBooking(null);
                setBookingError(null);
                setModo('presencial');
                setLocal('');
              }} className="px-4 py-2 text-sm font-medium">Cancelar</button>
              <button onClick={handleConfirm} disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold bg-primary-container text-on-primary-container rounded-lg disabled:opacity-50">
                {isSubmitting ? 'A marcar...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}