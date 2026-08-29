import { supabase } from '../../api/supabase';
import type { AdmissionImportRepository, AdmittedStudentRow } from '../../domain/admission/AdmittedStudentImport';

export class SupabaseAdmissionImportRepository implements AdmissionImportRepository {
  async bulkUpsert(rows: AdmittedStudentRow[]) {
    const errors: string[] = [];

    const { data, error } = await supabase
      .from('admitted_students')
      .upsert(
        rows.map((r) => ({
          numero_processo: r.numeroProcesso,
          nome: r.nome,
          curso_id: r.cursoId,
          data_nascimento: r.dataNascimento ?? null,
        })),
        { onConflict: 'numero_processo' }
      )
      .select();

    if (error) errors.push(error.message);

    return { inserted: data?.length ?? 0, updated: 0, errors };
  }
}