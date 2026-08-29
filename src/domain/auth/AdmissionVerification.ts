import type { CourseId } from "../test/TestQuestion";

export type AdmissionVerificationResult =
  | { matched: true; nome: string; cursoId: CourseId }
  | { matched: false };

export type AdmissionVerificationRepository = {
  verify(numeroProcesso: string): Promise<AdmissionVerificationResult>;
};