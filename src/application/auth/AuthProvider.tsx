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
      .select('id, nome, situacao, verification_status')
      .eq('id', userId)
      .single();
    setProfile(
      data
        ? { id: data.id, nome: data.nome, situacao: data.situacao, verificationStatus: data.verification_status }
        : null
    );
  }

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