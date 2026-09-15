import { supabase } from '../../api/supabase';
import type { PendingEnrollment } from '../../domain/admin/EnrollmentReviewRepository';
import type { EnrollmentDocumentRepository, ProfileVerificationUpdate } from '../../domain/auth/EnrollmentDocumentRepository';
import type { CourseId } from '../../domain/test/TestQuestion';

type PendingRow = {
  id: string;
  user_id: string;
  file_path: string;
  created_at: string;
  profiles: { nome: string; numero_processo: string | null; curso_id: CourseId | null } | null;
};

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos (É -> E)
    .replace(/[^a-zA-Z0-9._-]/g, '_'); // troca espaços e outros caracteres inválidos por "_"
}

export class SupabaseEnrollmentDocumentRepository implements EnrollmentDocumentRepository {
  async uploadDocument(userId: string, file: File) {
  // cancela documentos pendentes anteriores desta conta — só um pedido activo por utilizador
  await supabase
    .from('enrollment_documents')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('status', 'pending');

  const safeName = sanitizeFileName(file.name);
  const filePath = `${userId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from('enrollment-documents').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase
    .from('enrollment_documents')
    .insert({ user_id: userId, file_path: filePath, file_name: file.name });
  if (insertError) throw insertError;
}

  async updateProfileVerification(userId: string, input: ProfileVerificationUpdate) {
  const { error } = await supabase
    .from('profiles')
    .update({
      situacao: input.situacao,
      curso_id: input.cursoId,
      numero_processo: input.numeroProcesso,
      verification_status: input.verificationStatus,
      telefone: input.telefone ?? null,
      turno: input.turno ?? null,
      ano_academico: input.anoAcademico ?? null,
    })
    .eq('id', userId);
  if (error) throw error;
}

  async getPendingEnrollments(): Promise<PendingEnrollment[]> {
  const { data, error } = await supabase
    .from('enrollment_documents')
    .select('id, user_id, file_path, created_at, profiles(nome, numero_processo, curso_id)')
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
}

