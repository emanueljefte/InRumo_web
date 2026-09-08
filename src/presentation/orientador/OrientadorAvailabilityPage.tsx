import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import type { AvailabilitySlot } from '../../domain/schedule/OrientationSession';

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function OrientadorAvailabilityPage() {
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [diaSemana, setDiaSemana] = useState(1);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFim, setHoraFim] = useState('12:00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    scheduleRepository.getMyAvailability(session.user.id).then((s) => {
      setSlots(s);
      setLoading(false);
    });
  }, [session, scheduleRepository]);

  const handleAdd = async () => {
    if (!session) return;
    await scheduleRepository.addAvailability(session.user.id, diaSemana, horaInicio, horaFim);
    setSlots(await scheduleRepository.getMyAvailability(session.user.id));
  };

  const handleRemove = async (id: string) => {
    await scheduleRepository.removeAvailability(id);
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-headline-lg text-on-surface">Disponibilidade</h1>

      <div className="space-y-2">
        {slots.length === 0 ? (
          <p className="font-body-sm text-on-surface-variant">Ainda não definiste disponibilidade.</p>
        ) : (
          slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4">
              <span className="font-body-sm text-on-surface">{DIAS[slot.diaSemana]}, {slot.horaInicio} - {slot.horaFim}</span>
              <button onClick={() => handleRemove(slot.id)} className="text-error"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))
        )}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-4">
        <p className="font-body-sm font-bold text-on-surface">Adicionar horário</p>
        <div className="grid grid-cols-3 gap-3">
          <select value={diaSemana} onChange={(e) => setDiaSemana(Number(e.target.value))} className="border border-outline-variant rounded-lg px-2 py-2 text-xs">
            {DIAS.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
          <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="border border-outline-variant rounded-lg px-2 py-2 text-xs" />
          <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} className="border border-outline-variant rounded-lg px-2 py-2 text-xs" />
        </div>
        <button onClick={handleAdd} className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container font-semibold py-2.5 rounded-xl text-sm">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>
    </div>
  );
}