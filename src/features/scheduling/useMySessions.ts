import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';

type SessionItem = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  durationMinutes: number;
  statusLabel: string;
};

export function useMySessions() {
  const { session: authSession } = useAuth();
  const [upcoming, setUpcoming] = useState<SessionItem[]>([]);
  const [past, setPast] = useState<SessionItem[]>([]);

  const load = useCallback(async () => {
    if (!authSession?.user) return;

    const { data: rows } = await supabase
      .from('orientation_sessions')
      .select('*')
      .eq('student_id', authSession.user.id);

    const now = new Date();
    const all = rows ?? [];

    const upcomingRows = all
      .filter((r) => new Date(r.scheduled_at) >= now && r.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    const pastRows = all
      .filter((r) => new Date(r.scheduled_at) < now || r.status !== 'scheduled')
      .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

    setUpcoming(upcomingRows.map(toItem));
    setPast(pastRows.map(toItem));
  }, [authSession?.user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const cancelSession = useCallback(async (id: string) => {
    await supabase.from('orientation_sessions').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', id);
    await load();
  }, [load]);

  return { upcoming, past, cancelSession };
}

function toItem(row: any): SessionItem {
  const statusLabels: Record<string, string> = {
    completed: 'Concluída', cancelled: 'Cancelada', no_show: 'Não compareceu', scheduled: 'Marcada',
  };
  const date = new Date(row.scheduled_at);
  return {
    id: row.id,
    dateLabel: new Intl.DateTimeFormat('pt-AO', { day: '2-digit', month: 'short' }).format(date),
    timeLabel: new Intl.DateTimeFormat('pt-AO', { hour: '2-digit', minute: '2-digit' }).format(date),
    durationMinutes: row.duration_minutes,
    statusLabel: statusLabels[row.status] ?? row.status,
  };
}