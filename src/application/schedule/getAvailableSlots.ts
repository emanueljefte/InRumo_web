// gera os horários livres dos próximos 7 dias, cruzando disponibilidade com sessões já marcadas
import type { AvailabilitySlot, OrientationSession } from '../../domain/schedule/OrientationSession';

export type FreeSlot = { orientadorId: string; dataHora: Date };

export function getAvailableSlots(availability: AvailabilitySlot[], existingSessions: OrientationSession[], daysAhead = 7): FreeSlot[] {
  const slots: FreeSlot[] = [];
  const now = new Date();

  for (let d = 0; d < daysAhead; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const diaSemana = day.getDay();

    availability
      .filter((a) => a.diaSemana === diaSemana)
      .forEach((slot) => {
        const [hStart] = slot.horaInicio.split(':').map(Number);
        const [hEnd] = slot.horaFim.split(':').map(Number);

        for (let h = hStart; h < hEnd; h++) {
          const dataHora = new Date(day);
          dataHora.setHours(h, 0, 0, 0);
          if (dataHora <= now) continue;

          const taken = existingSessions.some(
            (s) => s.orientadorId === slot.orientadorId && new Date(s.dataHora).getTime() === dataHora.getTime()
          );
          if (!taken) slots.push({ orientadorId: slot.orientadorId, dataHora });
        }
      });
  }

  return slots.sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());
}