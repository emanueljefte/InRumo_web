import type { Profile } from './AuthContext';

export function getHomeRoute(profile: Profile | null): string {
  if (!profile) return '/landingpage';
  if (profile.papel === 'administrador_academico') return '/admin';
  if (profile.papel === 'orientador') return '/orientador';
  if (profile.situacao === 'matriculado' && profile.verificationStatus === 'verified') return '/student';
  if (profile.situacao === 'matriculado' && profile.verificationStatus === 'pending') return '/pending-verification';
  if (profile.registrationIntent === 'matriculado' && (profile.verificationStatus === 'not_applicable' || profile.verificationStatus === 'rejected')) return '/complete-enrollment';
  return '/candidate';
}