import { supabase } from '../../api/supabase';
import type { EnrollmentDocumentRepository, ProfileVerificationUpdate } from '../../domain/auth/EnrollmentDocumentRepository';

export class SupabaseEnrollmentDocumentRepository implements EnrollmentDocumentRepository {
  async uploadDocument(userId: string, file: File) {
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('enrollment-documents')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase
      .from('enrollment_documents')
      .insert({ user_id: userId, file_path: filePath });
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
      })
      .eq('id', userId);
    if (error) throw error;
  }
}