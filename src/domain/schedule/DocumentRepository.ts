import type { SessionDocument } from "./Document";

export type DocumentRepository = {
  getDocuments(sessionId: string): Promise<SessionDocument[]>;
  uploadDocument(sessionId: string, userId: string, file: File): Promise<void>;
  getDownloadUrl(filePath: string): Promise<string>;
};