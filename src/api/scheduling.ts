import { supabase } from './supabase';

export type TimeSlot = {
  date: string;
  time: string;
  advisorId: string;
};

export async function getAvailableSlots(
  advisorId: string,
  fromDate: Date,
  toDate: Date,
): Promise<TimeSlot[]> {
  const [{ data: availability }, { data: blockedDates }, { data: existingSessions }] = await Promise.all([
    supabase.from('advisor_availability').select('*').eq('advisor_id', advisorId).eq('active', true),
    supabase.from('advisor_blocked_dates').select('*').eq('advisor_id', advisorId),
    supabase
      .from('orientation_sessions')
      .select('scheduled_at')
      .eq('advisor_id', advisorId)
      .eq('status', 'scheduled')
      .gte('scheduled_at', fromDate.toISOString())
      .lte('scheduled_at', toDate.toISOString()),
  ]);

  const blockedSet = new Set((blockedDates ?? []).map((b) => b.blocked_date));
  const occupiedSet = new Set(
    (existingSessions ?? []).map((s) => {
      const d = new Date(s.scheduled_at);
      return `${dateKey(d)}-${timeKey(d)}`;
    }),
  );

  const slots: TimeSlot[] = [];
  const cursor = new Date(fromDate);

  while (cursor <= toDate) {
    const dayOfWeek = cursor.getDay();
    const dateStr = dateKey(cursor);

    if (!blockedSet.has(dateStr)) {
      const dayAvailability = (availability ?? []).filter((a) => a.day_of_week === dayOfWeek);

      for (const av of dayAvailability) {
        const daySlots = generateSlotsForDay(av.start_time, av.end_time, av.slot_duration_minutes);
        for (const time of daySlots) {
          const key = `${dateStr}-${time}`;
          if (!occupiedSet.has(key) && isFutureSlot(cursor, time)) {
            slots.push({ date: dateStr, time, advisorId });
          }
        }
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return slots;
}

function generateSlotsForDay(start: string, end: string, durationMin: number): string[] {
  const slots: string[] = [];
  let [h, m] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += durationMin;
    if (m >= 60) { h += Math.floor(m / 60); m %= 60; }
  }
  return slots;
}

function isFutureSlot(date: Date, time: string): boolean {
  const [h, m] = time.split(':').map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(h, m, 0, 0);
  return slotDate.getTime() > Date.now();
}

function dateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function timeKey(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}