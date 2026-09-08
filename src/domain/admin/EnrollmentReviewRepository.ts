export type PendingEnrollment = {
  documentId: string;
  userId: string;
  userNome: string;
  filePath: string;
  createdAt: string;
};

export type EnrollmentReviewRepository = {
  getPendingEnrollments(): Promise<PendingEnrollment[]>;
  approveEnrollment(documentId: string, userId: string): Promise<void>;
  rejectEnrollment(documentId: string, userId: string): Promise<void>;
};