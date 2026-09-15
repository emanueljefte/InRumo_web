import type { SessionDocument } from "./Document";

export type DocumentRepository = {
  getDocuments(sessionId: string): Promise<SessionDocument[]>;
  uploadDocument(sessionId: string, userId: string, file: File): Promise<void>;
  getChatDocuments(chatId: string): Promise<SessionDocument[]>;
  uploadChatDocument(chatId: string, userId: string, file: File): Promise<string>;
  getDownloadUrl(filePath: string): Promise<string>;
};