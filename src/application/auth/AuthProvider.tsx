import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '../../api/supabase';
import { AuthContext, type Profile } from './AuthContext';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';


export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initializing, setInitializing] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('id, nome, email, situacao, papel, curso_id, numero_processo, telefone, turno, ano_academico, verification_status, especialidade, registration_intent, avatar_url')
      .eq('id', userId)
      .single();

    setProfile(
      data ? {
        id: data.id, nome: data.nome, email: data.email, situacao: data.situacao, papel: data.papel,
        cursoId: data.curso_id, numeroProcesso: data.numero_processo,
        telefone: data.telefone, turno: data.turno, anoAcademico: data.ano_academico,
        verificationStatus: data.verification_status,
        especialidade: data.especialidade, avatarUrl: data.avatar_url,
        registrationIntent: data.registration_intent
      } : null
    );
  }

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`profile-changes:${session.user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` },
        (payload) => {
          setProfile((prev) => prev ? {
            ...prev,
            situacao: payload.new.situacao,
            verificationStatus: payload.new.verification_status,
            cursoId: payload.new.curso_id,
          } : prev);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) {
        await loadProfile(data.session.user.id);
      }
      setInitializing(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);

  const signOut = async () => {
    await authRepository.signOut();
  };


  return (
    <AuthContext.Provider value={{ session, profile, initializing, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}