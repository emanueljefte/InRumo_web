import { supabase } from '../../api/supabase';
import type { AdmissionVerificationRepository, AdmissionVerificationResult } from '../../domain/auth/AdmissionVerification';

export class SupabaseAdmissionVerificationRepository implements AdmissionVerificationRepository {
  async verify(numeroProcesso: string): Promise<AdmissionVerificationResult> {
    const { data, error } = await supabase
      .from('admitted_students')
      .select('nome, curso_id, telefone, turno, ano_academico')
      .eq('numero_processo', numeroProcesso)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { matched: false };

    return {
      matched: true,
      nome: data.nome,
      cursoId: data.curso_id,
      telefone: data.telefone,
      turno: data.turno,
      anoAcademico: data.ano_academico,
    };
  }
}