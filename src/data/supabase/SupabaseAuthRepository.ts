import { supabase } from '../../api/supabase';
import type { AuthRepository, SignUpInput, SignInInput } from '../../domain/auth/AuthRepository';

export class SupabaseAuthRepository implements AuthRepository {
  async signUp({ nome, email, senha, intent }: SignUpInput & { intent: 'candidate' | 'matriculado' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome, registration_intent: intent } }, // lido pelo trigger
  });
  if (error) throw error;
  if (!data.user) throw new Error('Falha ao criar utilizador.');
  return { userId: data.user.id };
}

  async signIn({ email, senha }: SignInInput) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw error;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  async updatePassword(novaSenha: string) {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) throw error;
}
}