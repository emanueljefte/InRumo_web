import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { uploadDocumentFile, getDocumentDownloadUrl, deleteDocumentFile } from '../../api/documents';

export type DocumentItem = {
  id: string;
  session_id: string | null;
  file_name: string;
  file_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

export function useDocuments(sessionId?: string) {
  const { session: authSession } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!authSession?.user) return;

    let query = supabase
      .from('session_documents')
      .select('*')
      .eq('owner_id', authSession.user.id)
      .order('created_at', { ascending: false });

    if (sessionId) query = query.eq('session_id', sessionId);

    const { data } = await query;
    setDocuments((data ?? []) as DocumentItem[]);
  }, [authSession?.user?.id, sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFile = useCallback(async (file: File) => {
    if (!authSession?.user) return;
    setError(null);
    setUploading(true);

    try {
      const { path, sizeBytes } = await uploadDocumentFile(authSession.user.id, file);

      await supabase.from('session_documents').insert({
        session_id: sessionId ?? null,
        uploaded_by: authSession.user.id,
        owner_id: authSession.user.id,
        file_name: file.name,
        file_path: path,
        file_size_bytes: sizeBytes,
        mime_type: file.type || 'application/octet-stream',
      });

      await load();
    } catch {
      setError('Não foi possível enviar o ficheiro. Verifica a conexão e tenta de novo.');
    } finally {
      setUploading(false);
    }
  }, [authSession?.user?.id, sessionId, load]);

  const openDocument = useCallback(async (doc: DocumentItem) => {
    const url = await getDocumentDownloadUrl(doc.file_path);
    window.open(url, '_blank');
  }, []);

  const removeDocument = useCallback(async (doc: DocumentItem) => {
    await deleteDocumentFile(doc.file_path);
    await supabase.from('session_documents').delete().eq('id', doc.id);
    await load();
  }, [load]);

  return { documents, uploading, error, uploadFile, openDocument, removeDocument };
}