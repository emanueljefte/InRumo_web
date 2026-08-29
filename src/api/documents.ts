import { supabase } from './supabase';

const BUCKET = 'session-documents';

export async function uploadDocumentFile(
  userId: string,
  file: File,
): Promise<{ path: string; sizeBytes: number }> {
  const path = `${userId}/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  return { path, sizeBytes: file.size };
}

export async function getDocumentDownloadUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 5);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteDocumentFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}