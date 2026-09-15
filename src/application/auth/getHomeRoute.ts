import type { Profile } from './AuthContext';

export function getHomeRoute(profile: Profile | null): string {
  if (!profile) return '/landingpage';
  if (profile.papel === 'administrador_academico') return '/admin';
  if (profile.papel === 'orientador') return '/orientador';
  if (profile.situacao === 'matriculado' && profile.verificationStatus === 'verified') return '/student';
  if (profile.situacao === 'matriculado' && profile.verificationStatus === 'pending') return '/pending-verification';
  if (profile.verificationStatus === 'rejected') return '/enrollment-rejected'; 
  if (profile.registrationIntent === 'matriculado' && profile.verificationStatus === 'not_applicable') return '/complete-enrollment';
  return '/candidate';
}