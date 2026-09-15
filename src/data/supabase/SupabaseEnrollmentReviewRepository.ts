import { supabase } from '../../api/supabase';
import { isSupabaseError } from '../../application/auth/registerMatriculado';
import type { EnrollmentReviewRepository, PendingEnrollment } from '../../domain/admin/EnrollmentReviewRepository';
import type { CourseId } from '../../domain/test/TestQuestion';
import { SupabaseNotificationRepository } from './SupabaseNotificationRepository';

type PendingRow = {
    id: string;
    user_id: string;
    file_path: string;
    created_at: string;
    profiles: { nome: string; numero_processo: string | null; curso_id: CourseId | null };
};

export class SupabaseEnrollmentReviewRepository implements EnrollmentReviewRepository {

    async getPendingEnrollments(): Promise<PendingEnrollment[]> {
        const { data, error } = await supabase
            .from('enrollment_documents')
            .select('id, user_id, file_path, created_at, profiles(nome, curso_id, numero_processo)')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) throw error;

        const rows = data as unknown as PendingRow[];

        const items = rows.map((r) => ({
            documentId: r.id,
            userId: r.user_id,
            userNome: r.profiles?.nome ?? 'Utilizador',
            numeroProcesso: r.profiles?.numero_processo ?? '',
            cursoId: r.profiles?.curso_id ?? null,
            filePath: r.file_path,
            createdAt: r.created_at,
        }));

        console.log(items);


        // verifica, para cada pendente, se o número de processo já existe verificado noutra conta
        const results = await Promise.all(items.map(async (item) => {
            if (!item.numeroProcesso) return { ...item, isDuplicate: false };
            const { data: existing } = await supabase
                .from('profiles')
                .select('id')
                .eq('numero_processo', item.numeroProcesso)
                .eq('verification_status', 'verified')
                .neq('id', item.userId)
                .maybeSingle();
            return { ...item, isDuplicate: Boolean(existing) };
        }));

        return results;
    }

    async approveEnrollment(documentId: string, userId: string, numeroProcesso: string, cursoId: CourseId) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                situacao: 'matriculado',
                curso_id: cursoId,
                numero_processo: numeroProcesso,
                verification_status: 'verified',
            })
            .eq('id', userId);

        if (profileError) {
            if (isSupabaseError(profileError) && profileError.code === '23505') {
                throw new Error('Este número de processo já está associado a outra conta verificada. Verifica se não é um duplicado antes de aprovar.');
            }
            throw profileError;
        }

        const { error: docError } = await supabase
            .from('enrollment_documents')
            .update({ status: 'approved', reviewed_at: new Date().toISOString() })
            .eq('id', documentId);
        if (docError) throw docError;

        const notificationRepo = new SupabaseNotificationRepository();
        await notificationRepo.create(userId, 'matricula_aprovada', 'A tua matrícula foi validada. Já tens acesso completo.');
    }

    async rejectEnrollment(documentId: string, userId: string) {
        // não rejeita a conta se já estiver verified entretanto (evita sobrescrever aprovação anterior)
        const { data: currentProfile } = await supabase.from('profiles').select('verification_status').eq('id', userId).single();
        if (currentProfile?.verification_status === 'verified') {
            // só fecha este documento específico, sem mexer no estado da conta
            await supabase.from('enrollment_documents').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', documentId);
            return;
        }

        const { error: docError } = await supabase.from('enrollment_documents').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', documentId);
        if (docError) throw docError;

        const { error: profileError } = await supabase.from('profiles').update({ verification_status: 'rejected' }).eq('id', userId);
        if (profileError) throw profileError;

        const notificationRepo = new SupabaseNotificationRepository();
        await notificationRepo.create(userId, 'matricula_rejeitada', 'A tua matrícula não foi validada. Contacta a Administração Académica.');
    }
}