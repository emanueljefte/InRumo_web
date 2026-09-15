import { supabase } from '../../api/supabase';
import { isSupabaseError } from '../../application/auth/registerMatriculado';
import type { AvailabilitySlot, OrientationSession } from '../../domain/schedule/OrientationSession';
import type { ScheduleRepository } from '../../domain/schedule/ScheduleRepository';
import { SupabaseNotificationRepository } from './SupabaseNotificationRepository';

type AvailabilityRow = { id: string; orientador_id: string; dia_semana: number; hora_inicio: string; hora_fim: string };

type SessionRowWithProfile = SessionRow & {
  profiles: { nome: string }[] | { nome: string } | null;
};

type SessionRow = {
    id: string;
    matriculado_id: string;
    orientador_id: string;
    data_hora: string;
    estado: 'marcada' | 'concluida' | 'cancelada';
    modo: 'presencial' | 'online';
    local: string | null;
    notas_orientador: string | null;
    motivo_cancelamento: string | null;
};

function mapAvailability(r: AvailabilityRow): AvailabilitySlot {
    return { id: r.id, orientadorId: r.orientador_id, diaSemana: r.dia_semana, horaInicio: r.hora_inicio, horaFim: r.hora_fim };
}

export class SupabaseScheduleRepository implements ScheduleRepository {
    async getAvailability() {
        const { data, error } = await supabase.from('orientador_availability').select('*');
        if (error) throw error;
        return data.map((r) => ({
            id: r.id, orientadorId: r.orientador_id, diaSemana: r.dia_semana, horaInicio: r.hora_inicio, horaFim: r.hora_fim,
        }));
    }

    async createSession(matriculadoId: string, orientadorId: string, dataHora: string, modo: 'presencial' | 'online', local?: string): Promise<OrientationSession> {
  const { data, error } = await supabase
    .from('orientation_sessions')
    .insert({ matriculado_id: matriculadoId, orientador_id: orientadorId, data_hora: dataHora, modo, local: local ?? null })
    .select()
    .single();

  if (error) {
    if (isSupabaseError(error) && error.code === '23505') {
      throw new Error('Este horário já foi reservado por outra pessoa. Escolhe outro.');
    }
    throw error;
  }

  const notificationRepo = new SupabaseNotificationRepository();
  await notificationRepo.create(orientadorId, 'sessao_marcada', 'Uma nova sessão de orientação foi marcada.');

  return mapSession(data as SessionRow);
}

    async getSessionsForMatriculado(matriculadoId: string) {
        const { data, error } = await supabase
            .from('orientation_sessions')
            .select('id, matriculado_id, orientador_id, data_hora, estado, modo, local, notas_orientador, motivo_cancelamento')
            .eq('matriculado_id', matriculadoId)
            .order('data_hora', { ascending: false });
        if (error) throw error;
        return (data as SessionRow[]).map(mapSession);
    }

    async cancelSession(sessionId: string) {
        const { error } = await supabase.from('orientation_sessions').update({ estado: 'cancelada' }).eq('id', sessionId);
        if (error) throw error;
    }

    async getOrientadores() {
        const { data, error } = await supabase.from('profiles').select('id, nome').eq('papel', 'orientador');
        if (error) throw error;
        return data;
    }

    async getUpcomingSessions(orientadorIds: string[], from: Date, to: Date) {
        const { data, error } = await supabase
            .from('orientation_sessions')
            .select('id, matriculado_id, orientador_id, data_hora, estado, modo, local, notas_orientador, motivo_cancelamento')
            .in('orientador_id', orientadorIds)
            .gte('data_hora', from.toISOString())
            .lte('data_hora', to.toISOString())
            .neq('estado', 'cancelada');
        if (error) throw error;
        return (data as SessionRow[]).map(mapSession);
    }

    async getMyAvailability(orientadorId: string) {
        const { data, error } = await supabase.from('orientador_availability').select('*').eq('orientador_id', orientadorId);
        if (error) throw error;
        return (data as AvailabilityRow[]).map(mapAvailability);
    }

    async addAvailability(orientadorId: string, diaSemana: number, horaInicio: string, horaFim: string) {
        const { error } = await supabase.from('orientador_availability').insert({
            orientador_id: orientadorId, dia_semana: diaSemana, hora_inicio: horaInicio, hora_fim: horaFim,
        });
        if (error) throw error;
    }

    async removeAvailability(slotId: string) {
        const { error } = await supabase.from('orientador_availability').delete().eq('id', slotId);
        if (error) throw error;
    }

    async getSessionsForOrientador(orientadorId: string) {
        const { data, error } = await supabase
            .from('orientation_sessions')
            .select('id, matriculado_id, orientador_id, data_hora, estado, modo, local, notas_orientador, motivo_cancelamento, profiles!orientation_sessions_matriculado_id_fkey(nome)')
            .eq('orientador_id', orientadorId)
            .neq('estado', 'cancelada')
            .order('data_hora', { ascending: true });
        if (error) throw error;

        return (data as unknown as SessionRowWithProfile[]).map((r) => {
  const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;

  return {
    ...mapSession(r as SessionRow),
    matriculadoNome: profile?.nome ?? 'Matriculado',
  };
});
    }

    async concludeSession(sessionId: string) {
        const { error } = await supabase.from('orientation_sessions').update({ estado: 'concluida' }).eq('id', sessionId);
        if (error) throw error;
    }

    async cancelSessionByOrientador(sessionId: string, motivo: string) {
        const { error } = await supabase.from('orientation_sessions')
            .update({ estado: 'cancelada', motivo_cancelamento: motivo })
            .eq('id', sessionId);
        if (error) throw error;

        const { data: sessionData } = await supabase.from('orientation_sessions').select('matriculado_id').eq('id', sessionId).single();
        if (sessionData) {
            const notificationRepo = new SupabaseNotificationRepository();
            await notificationRepo.create(sessionData.matriculado_id, 'sessao_cancelada', `A tua sessão foi cancelada pelo orientador: ${motivo}`);
        }
    }

    async concludeSessionWithNotes(sessionId: string, notas: string) {
        const { error } = await supabase.from('orientation_sessions')
            .update({ estado: 'concluida', notas_orientador: notas })
            .eq('id', sessionId);
        if (error) throw error;
    }
}

function mapSession(r: SessionRow): OrientationSession {
    return {
        id: r.id,
        matriculadoId: r.matriculado_id,
        orientadorId: r.orientador_id,
        dataHora: r.data_hora,
        estado: r.estado,
        modo: r.modo,
        local: r.local,
        notasOrientador: r.notas_orientador,
        motivoCancelamento: r.motivo_cancelamento,
    };
}