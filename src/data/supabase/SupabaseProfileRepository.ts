import { supabase } from "../../api/supabase";
import type { Profile } from "../../application/auth/AuthContext";
import { sanitizeFileName } from "../../application/schedule/sanitizeFileName";
import type { ProfileRepository, UpdateProfileInput } from "../../domain/auth/ProfileRepository";
import type { CourseId } from "../../domain/test/TestQuestion";

type ProfileRow = {
  id: string; nome: string; situacao: 'candidate' | 'matriculado'; papel: Profile['papel'];
  verification_status: Profile['verificationStatus']; registration_intent?: string;
  avatar_url?: string; curso_id?: CourseId; numero_processo?: string;
  telefone?: string; turno?: string; ano_academico?: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    nome: row.nome,
    situacao: row.situacao,
    papel: row.papel,
    verificationStatus: row.verification_status,
    registrationIntent: row.registration_intent as Profile['registrationIntent'],
    avatarUrl: row.avatar_url,
    cursoId: row.curso_id,
    numeroProcesso: row.numero_processo,
    telefone: row.telefone,
    turno: row.turno,
    anoAcademico: row.ano_academico,
  };
}

export class SupabaseProfileRepository implements ProfileRepository {
  async getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return mapProfile(data as ProfileRow);
}

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (input.nome !== undefined) payload.nome = input.nome;
    if (input.situacao !== undefined) payload.situacao = input.situacao;
    if (input.cursoId !== undefined) payload.curso_id = input.cursoId;
    if (input.numeroProcesso !== undefined) payload.numero_processo = input.numeroProcesso;

    const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
    if (error) throw error;
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const filePath = `${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId);
    if (updateError) throw updateError;

    return data.publicUrl;
  }
}