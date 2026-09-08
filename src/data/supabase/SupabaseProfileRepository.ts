import { supabase } from "../../api/supabase";
import type { Profile } from "../../application/auth/AuthContext";
import type { ProfileRepository, UpdateProfileInput } from "../../domain/auth/ProfileRepository";

export class SupabaseProfileRepository implements ProfileRepository {
  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return { id: data.id, nome: data.nome, situacao: data.situacao, verificationStatus: data.verification_status, registrationIntent: data.registration_intent };
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
}