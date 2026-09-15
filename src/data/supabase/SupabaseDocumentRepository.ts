import { supabase } from "../../api/supabase";
import { sanitizeFileName } from "../../application/schedule/sanitizeFileName";
import type { SessionDocument } from "../../domain/schedule/Document";
import type { DocumentRepository } from "../../domain/schedule/DocumentRepository";

type DocumentRow = {
  id: string;
  session_id: string | null;
  chat_id: string | null;
  uploaded_by: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  created_at: string;
};

function mapDocument(r: DocumentRow): SessionDocument {
  return {
    id: r.id,
    sessionId: r.session_id,
    chatId: r.chat_id,
    uploadedBy: r.uploaded_by,
    filePath: r.file_path,
    fileName: r.file_name,
    fileSize: r.file_size,
    createdAt: r.created_at,
  };
}

export class SupabaseDocumentRepository implements DocumentRepository {
  async getDocuments(sessionId: string): Promise<SessionDocument[]> {
    const { data, error } = await supabase.from('documents').select('*').eq('session_id', sessionId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data as DocumentRow[]).map(mapDocument);
  }

  async uploadDocument(sessionId: string, userId: string, file: File): Promise<void> {
    const filePath = `session/${sessionId}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from('session-documents').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from('documents').insert({
      session_id: sessionId, chat_id: null, uploaded_by: userId, file_path: filePath, file_name: file.name, file_size: file.size,
    });
    if (insertError) throw insertError;
  }

  async getChatDocuments(chatId: string): Promise<SessionDocument[]> {
    const { data, error } = await supabase.from('documents').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data as DocumentRow[]).map(mapDocument);
  }

  async uploadChatDocument(chatId: string, userId: string, file: File): Promise<string> {
  const filePath = `chat/${chatId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from('session-documents').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from('documents').insert({
    session_id: null, chat_id: chatId, uploaded_by: userId, file_path: filePath, file_name: file.name, file_size: file.size,
  });
  if (insertError) throw insertError;

  return filePath;
}

  async getDownloadUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage.from('session-documents').createSignedUrl(filePath, 60 * 5);
    if (error) throw error;
    return data.signedUrl;
  }
}