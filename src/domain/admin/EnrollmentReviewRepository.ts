import type { CourseId } from "../test/TestQuestion";

export type PendingEnrollment = {
  documentId: string;
  userId: string;
  userNome: string;
  numeroProcesso: string;
  cursoId: CourseId | null;
  filePath: string;
  createdAt: string;
  isDuplicate: boolean;
};

export type EnrollmentReviewRepository = {
  getPendingEnrollments(): Promise<PendingEnrollment[]>;
  approveEnrollment(documentId: string, userId: string, numeroProcesso: string, cursoId: CourseId): Promise<void>;
  rejectEnrollment(documentId: string, userId: string): Promise<void>;
};