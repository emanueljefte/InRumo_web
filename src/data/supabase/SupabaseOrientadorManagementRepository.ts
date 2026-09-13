import { supabase } from '../../api/supabase';
import type { CreateOrientadorInput, OrientadorSummary } from '../../domain/admin/OrientadorManagement';
import type { CreateOrientadorResult, OrientadorManagementRepository, } from '../../domain/admin/OrientadorManagementRepository';

export class SupabaseOrientadorManagementRepository implements OrientadorManagementRepository {
  async listOrientadores(): Promise<OrientadorSummary[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, email, especialidade')
      .eq('papel', 'orientador');
    if (error) throw error;
    return data;
  }

  async createOrientador(input: CreateOrientadorInput): Promise<CreateOrientadorResult> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Sessão inválida.');

    const { data, error } = await supabase.functions.invoke('create-orientador', {
      body: { ...input, requesterId: session.user.id },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);

    return { userId: data.userId, tempPassword: data.tempPassword };
  }

  async removeOrientador(id: string) {
    // remove o papel, não a conta (mantém histórico de chats/sessões já associados)
    const { error } = await supabase.from('profiles').update({ papel: 'utilizador' }).eq('id', id);
    if (error) throw error;
  }
}