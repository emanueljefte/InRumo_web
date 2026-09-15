export type SessionDocument = {
  id: string;
  sessionId: string | null;
  chatId: string | null;
  uploadedBy: string;
  filePath: string;
  fileName: string;
  fileSize: number | null;
  createdAt: string;
};