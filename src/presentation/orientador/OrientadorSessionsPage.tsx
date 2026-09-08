import { useEffect, useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import type { OrientationSessionWithNome } from '../../domain/schedule/ScheduleRepository';

export default function OrientadorSessionsPage() {
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);
  const [sessions, setSessions] = useState<OrientationSessionWithNome[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    scheduleRepository.getSessionsForOrientador(session.user.id).then((s) => {
      setSessions(s);
      setLoading(false);
    });
  }, [session, scheduleRepository]);

  const handleConclude = async (id: string) => {
    await scheduleRepository.concludeSession(id);
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, estado: 'concluida' } : s)));
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-headline-lg text-on-surface">Sessões</h1>

      {sessions.length === 0 ? (
        <p className="font-body-sm text-on-surface-variant text-center py-12">Sem sessões marcadas.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4">
              <div>
                <p className="font-body-sm font-medium text-on-surface">{s.matriculadoNome}</p>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {new Date(s.dataHora).toLocaleString('pt-PT', { weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {s.estado === 'marcada' ? (
                <button onClick={() => handleConclude(s.id)} className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" /> Concluir
                </button>
              ) : (
                <span className="text-xs text-on-surface-variant font-medium">Concluída</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}