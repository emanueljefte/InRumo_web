import { createContext } from 'react';
import { type Session } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  nome: string;
  situacao: 'candidate' | 'student';
  verificationStatus: 'not_applicable' | 'verified' | 'pending' | 'rejected';
};

export type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  initializing: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({ session: null, profile: null, initializing: true, signOut: async () => {}, });
