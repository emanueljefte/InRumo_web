import { supabase } from '../../api/supabase';
import type { EnrollmentReviewRepository, PendingEnrollment } from '../../domain/admin/EnrollmentReviewRepository';
import { SupabaseNotificationRepository } from './SupabaseNotificationRepository';

type PendingRow = {
    id: string;
    user_id: string;
    file_path: string;
    created_at: string;
    profiles: { nome: string } | null;
};

export class SupabaseEnrollmentReviewRepository implements EnrollmentReviewRepository {
    async getPendingEnrollments(): Promise<PendingEnrollment[]> {
        const { data, error } = await supabase
            .from('enrollment_documents')
            .select('id, user_id, file_path, created_at, profiles(nome)')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

            console.log('RAW RESPONSE:', JSON.stringify(data, null, 2));
        if (error) throw error;

        return (data as unknown as PendingRow[]).map((r) => ({
            documentId: r.id,
            userId: r.user_id,
            userNome: r.profiles?.nome ?? 'Utilizador',
            filePath: r.file_path,
            createdAt: r.created_at,
        }));
    }

    async approveEnrollment(documentId: string, userId: string) {
        const { error: docError } = await supabase
            .from('enrollment_documents')
            .update({ status: 'approved', reviewed_at: new Date().toISOString() })
            .eq('id', documentId);
        if (docError) throw docError;

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ verification_status: 'verified' })
            .eq('id', userId);
        if (profileError) throw profileError;

        const notificationRepo = new SupabaseNotificationRepository();
        await notificationRepo.create(userId, 'matricula_aprovada', 'A tua matrícula foi validada. Já tens acesso completo.');
    }

    async rejectEnrollment(documentId: string, userId: string) {
        const { error: docError } = await supabase
            .from('enrollment_documents')
            .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
            .eq('id', documentId);
        if (docError) throw docError;

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ verification_status: 'rejected' })
            .eq('id', userId);
        if (profileError) throw profileError;

        const notificationRepo = new SupabaseNotificationRepository();
        await notificationRepo.create(userId, 'matricula_rejeitada', 'A tua matrícula não foi validada. Não tens acesso completo.');
    }
}