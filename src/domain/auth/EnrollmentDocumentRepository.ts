import type { CourseId } from "../test/TestQuestion";

export type ProfileVerificationUpdate = {
  situacao: 'matriculado';
  cursoId: CourseId;
  numeroProcesso: string;
  verificationStatus: 'verified' | 'pending';
};

export type EnrollmentDocumentRepository = {
  uploadDocument(userId: string, file: File): Promise<void>;
  updateProfileVerification(userId: string, input: ProfileVerificationUpdate): Promise<void>;
};