import { supabase } from '../../api/supabase';
import { sanitizeFileName } from '../../application/schedule/sanitizeFileName';
import type { SessionDocument } from '../../domain/schedule/Document';
import type { DocumentRepository, } from '../../domain/schedule/DocumentRepository';

type DocumentRow = {
  id: string;
  session_id: string;
  uploaded_by: string;
  file_path: string;
  file_name: string;
  file_size: number;
  created_at: string;
};

function mapDocument(r: DocumentRow): SessionDocument {
  return { id: r.id, sessionId: r.session_id, uploadedBy: r.uploaded_by, filePath: r.file_path, fileName: r.file_name, createdAt: r.created_at, fileSize: r.file_size, };
}

export class SupabaseDocumentRepository implements DocumentRepository {
  async getDocuments(sessionId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as DocumentRow[]).map(mapDocument);
  }

  async uploadDocument(sessionId: string, userId: string, file: File) {
  const filePath = `${sessionId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage.from('session-documents').upload(filePath, file);
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase.from('documents').insert({
    session_id: sessionId, uploaded_by: userId, file_path: filePath, file_name: file.name, file_size: file.size,
  });
  if (insertError) throw insertError;
}

  async getDownloadUrl(filePath: string) {
    const { data, error } = await supabase.storage.from('session-documents').createSignedUrl(filePath, 60 * 5); // 5 min
    if (error) throw error;
    return data.signedUrl;
  }
}