import { supabase } from '../../api/supabase';
import type { PendingEnrollment } from '../../domain/admin/EnrollmentReviewRepository';
import type { EnrollmentDocumentRepository, ProfileVerificationUpdate } from '../../domain/auth/EnrollmentDocumentRepository';

type PendingRow = {
  id: string;
  user_id: string;
  file_path: string;
  created_at: string;
  profiles: { nome: string }[];
};

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos (É -> E)
    .replace(/[^a-zA-Z0-9._-]/g, '_'); // troca espaços e outros caracteres inválidos por "_"
}

export class SupabaseEnrollmentDocumentRepository implements EnrollmentDocumentRepository {
  async uploadDocument(userId: string, file: File) {
  const safeName = sanitizeFileName(file.name);
  const filePath = `${userId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('enrollment-documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Erro no upload:', uploadError); // adiciona isto temporariamente
    throw uploadError;
  }

  const { error: insertError } = await supabase
    .from('enrollment_documents')
    .insert({ user_id: userId, file_path: filePath, file_name: file.name });

  if (insertError) {
    console.error('Erro no insert:', insertError);
    throw insertError;
  }
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
    .select('id, user_id, file_path, created_at, profiles(nome)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data as PendingRow[]).map((r) => ({
    documentId: r.id,
    userId: r.user_id,
    userNome: r.profiles?.[0]?.nome ?? 'Utilizador',
    filePath: r.file_path,
    createdAt: r.created_at,
  }));
}
}

