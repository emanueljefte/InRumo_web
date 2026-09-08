import { supabase } from '../../api/supabase';
import type { AvailabilitySlot, OrientationSession } from '../../domain/schedule/OrientationSession';
import type { ScheduleRepository } from '../../domain/schedule/ScheduleRepository';
import { SupabaseNotificationRepository } from './SupabaseNotificationRepository';

type AvailabilityRow = { id: string; orientador_id: string; dia_semana: number; hora_inicio: string; hora_fim: string };

type SessionRow = {
    id: string;
    matriculado_id: string;
    orientador_id: string;
    data_hora: string;
    estado: 'marcada' | 'concluida' | 'cancelada';
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

    async createSession(matriculadoId: string, orientadorId: string, dataHora: string) {
        const { error } = await supabase.from('orientation_sessions').insert({
            matriculado_id: matriculadoId, orientador_id: orientadorId, data_hora: dataHora,
        });
        if (error) throw error;
        
        const notificationRepo = new SupabaseNotificationRepository();
        await notificationRepo.create(orientadorId, 'sessao_marcada', 'Uma nova sessão de orientação foi marcada.');
    }

    async getSessionsForMatriculado(matriculadoId: string) {
        const { data, error } = await supabase
            .from('orientation_sessions')
            .select('*')
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
            .select('*')
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
            .select('*, profiles!orientation_sessions_matriculado_id_fkey(nome)')
            .eq('orientador_id', orientadorId)
            .neq('estado', 'cancelada')
            .order('data_hora', { ascending: true });
        if (error) throw error;

        return (data as (SessionRow & { profiles: { nome: string }[] })[]).map((r) => ({
            ...mapSession(r),
            matriculadoNome: r.profiles?.[0]?.nome ?? 'Matriculado',
        }));
    }

    async concludeSession(sessionId: string) {
        const { error } = await supabase.from('orientation_sessions').update({ estado: 'concluida' }).eq('id', sessionId);
        if (error) throw error;
    }
}

function mapSession(r: SessionRow): OrientationSession {
    return { id: r.id, matriculadoId: r.matriculado_id, orientadorId: r.orientador_id, dataHora: r.data_hora, estado: r.estado };
}