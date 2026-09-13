import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Clock, Calendar, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import type { AvailabilitySlot } from '../../domain/schedule/OrientationSession';

const DIAS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export default function OrientadorAvailabilityPage() {
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [diaSemana, setDiaSemana] = useState(1);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFim, setHoraFim] = useState('12:00');
  
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    scheduleRepository.getMyAvailability(session.user.id)
      .then((s) => setSlots(s))
      .finally(() => setLoading(false));
  }, [session, scheduleRepository]);

  // Validação e Adição de Horário
  const handleAdd = async () => {
    if (!session) return;
    setErrorMessage(null);

    // Validação básica de horário
    if (horaInicio >= horaFim) {
      setErrorMessage('O horário de início deve ser anterior ao horário de término.');
      return;
    }

    setIsAdding(true);
    try {
      await scheduleRepository.addAvailability(session.user.id, diaSemana, horaInicio, horaFim);
      const updatedSlots = await scheduleRepository.getMyAvailability(session.user.id);
      setSlots(updatedSlots);
    } catch {
      setErrorMessage('Ocorreu um erro ao adicionar o horário. Tente novamente.');
    } finally {
      setIsAdding(false);
    }
  };

  // Remoção de Horário
  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await scheduleRepository.removeAvailability(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setRemovingId(null);
    }
  };

  // Agrupa slots por dia da semana para melhor leitura
  const slotsGroupedByDay = useMemo(() => {
    const grouped: { [key: number]: AvailabilitySlot[] } = {};
    slots.forEach((slot) => {
      if (!grouped[slot.diaSemana]) {
        grouped[slot.diaSemana] = [];
      }
      grouped[slot.diaSemana].push(slot);
    });
    return grouped;
  }, [slots]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-surface-container-high/60 rounded-2xl w-48" />
        <div className="h-32 bg-surface-container-high/60 rounded-3xl" />
        <div className="h-48 bg-surface-container-high/60 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* ================= CABEÇALHO ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-2">
            <Sparkles size={14} />
            <span>Configuração da Agenda</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Horários de Disponibilidade
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Defina os dias e turnos em que estará disponível para atender os estudantes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 rounded-2xl shrink-0 self-start md:self-auto">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-on-surface">
            {slots.length} {slots.length === 1 ? 'Turno Ativo' : 'Turnos Ativos'}
          </span>
        </div>
      </div>

      {/* ================= FORMULÁRIO DE ADIÇÃO ================= */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-bold text-base text-on-surface">
            Adicionar Novo Intervalo
          </h2>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-error/10 text-error text-xs font-semibold border border-error/20">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Seleção do Dia */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Dia da Semana</label>
            <select
              value={diaSemana}
              onChange={(e) => setDiaSemana(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-xs sm:text-sm text-on-surface font-medium focus:outline-none focus:border-primary/60 transition-all cursor-pointer"
            >
              {DIAS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Hora de Início */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Hora de Início</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-xs sm:text-sm text-on-surface font-medium focus:outline-none focus:border-primary/60 transition-all"
            />
          </div>

          {/* Hora de Término */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Hora de Término</label>
            <input
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-xs sm:text-sm text-on-surface font-medium focus:outline-none focus:border-primary/60 transition-all"
            />
          </div>

        </div>

        <button
          type="button"
          disabled={isAdding}
          onClick={handleAdd}
          className="w-full py-3 rounded-2xl bg-primary text-on-primary font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isAdding ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Adicionando Horário...</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Confirmar Disponibilidade</span>
            </>
          )}
        </button>
      </div>

      {/* ================= HORÁRIOS CADASTRADOS AGRUPADOS ================= */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-on-surface">
          Turnos Configurados
        </h2>

        {slots.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div className="max-w-xs mx-auto space-y-1">
              <p className="font-heading font-bold text-base text-on-surface">
                Nenhum horário cadastrado
              </p>
              <p className="text-xs text-on-surface-variant">
                Adicione intervalos acima para permitir que estudantes agendem orientações.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(slotsGroupedByDay).map((dayKey) => {
              const dayIndex = Number(dayKey);
              const daySlots = slotsGroupedByDay[dayIndex];

              return (
                <div
                  key={dayIndex}
                  className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-5 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                    <CheckCircle2 size={14} />
                    <span>{DIAS[dayIndex]}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between bg-surface-container-low border border-outline-variant/30 rounded-2xl p-3.5 hover:border-outline-variant transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock size={16} className="text-on-surface-variant" />
                          <span className="font-mono text-xs font-bold text-on-surface">
                            {slot.horaInicio} - {slot.horaFim}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={removingId === slot.id}
                          onClick={() => handleRemove(slot.id)}
                          className="p-1.5 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Remover horário"
                        >
                          {removingId === slot.id ? (
                            <Loader2 size={16} className="animate-spin text-error" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}