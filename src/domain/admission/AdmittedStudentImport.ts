import type { CourseId } from "../test/TestQuestion";

export type AdmittedStudentRow = {
  numeroProcesso: string;
  nome: string;
  cursoId: CourseId;
  dataNascimento?: string;
};

export type AdmissionImportRepository = {
  bulkUpsert(rows: AdmittedStudentRow[]): Promise<{ inserted: number; updated: number; errors: string[] }>;
};