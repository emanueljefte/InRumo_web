import type { CourseId } from "../test/TestQuestion";

export type AdmissionVerificationResult =
  | { matched: true; nome: string; cursoId: CourseId; telefone: string | null; turno: string | null; anoAcademico: string | null }
  | { matched: false };

export type AdmissionVerificationRepository = {
  verify(numeroProcesso: string): Promise<AdmissionVerificationResult>;
};