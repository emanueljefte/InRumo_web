import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../api/supabase';
import { getAvailableSlots, type TimeSlot } from '../../api/scheduling';
import { useAuth } from '../../application/auth/useAuth';

const DAYS_AHEAD = 14;
const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DEFAULT_ADVISOR_ID = 'advisor-placeholder-id'; // mesmo placeholder do mobile

export function useNewSession(selectedDate: string | null) {
  const { session } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    (async () => {
      const from = new Date();
      const to = new Date();
      to.setDate(to.getDate() + DAYS_AHEAD);
      const result = await getAvailableSlots(DEFAULT_ADVISOR_ID, from, to);
      setSlots(result);
    })();
  }, []);

  const dates = useMemo(() => {
    const uniqueDates = [...new Set(slots.map((s) => s.date))].sort();
    return uniqueDates.map((iso) => {
      const d = new Date(iso);
      return { iso, weekday: WEEKDAY_LABELS[d.getDay()], day: d.getDate() };
    });
  }, [slots]);

  const timesForDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((s) => s.date === selectedDate).map((s) => s.time).sort();
  }, [slots, selectedDate]);

  const confirm = async (date: string, time: string) => {
    if (!session?.user) return;
    setBooking(true);

    const [h, m] = time.split(':').map(Number);
    const scheduledAt = new Date(date);
    scheduledAt.setHours(h, m, 0, 0);

    await supabase.from('orientation_sessions').insert({
      student_id: session.user.id,
      advisor_id: DEFAULT_ADVISOR_ID,
      scheduled_at: scheduledAt.toISOString(),
      duration_minutes: 30,
      status: 'scheduled',
    });

    setBooking(false);
  };

  return { dates, timesForDate, booking, confirm };
}