import { createContext } from 'react';
import { type Session } from '@supabase/supabase-js';
import type { CourseId } from '../../domain/test/TestQuestion';

export type Profile = {
  id: string;
  nome: string;
  situacao: 'candidate' | 'matriculado';
  papel: 'utilizador' | 'orientador' | 'administrador_academico';
  cursoId?: CourseId;
  numeroProcesso?: string;
  telefone?: string | null;
  turno?: string | null;
  anoAcademico?: string | null;
  verificationStatus: 'not_applicable' | 'verified' | 'pending' | 'rejected';
};

export type AuthContextValue = {
  session: Session | null;
  profile: Profile | null;
  initializing: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({ session: null, profile: null, initializing: true, signOut: async () => {}, });
