import type { AdmissionVerificationRepository } from "../../domain/auth/AdmissionVerification";
import type { ProfileRepository } from "../../domain/auth/ProfileRepository";
import { normalizeName } from "./normalizeName";

export async function upgradeToMatriculado(
  userId: string,
  numeroProcesso: string,
  verificationRepo: AdmissionVerificationRepository,
  profileRepo: ProfileRepository,
) {
  const result = await verificationRepo.verify(numeroProcesso);

  if (!result.matched) {
    throw new Error('Número de processo não encontrado ou inválido.');
  }

  // comparação com os dados já introduzidos (nome do registo original)
  const currentProfile = await profileRepo.getProfile(userId);
  const nameMatches = normalizeName(currentProfile.nome) === normalizeName(result.nome);

  if (!nameMatches) {
    // não bloqueia automaticamente — sinaliza para revisão humana (evita falsos negativos por nomes compostos/acentos)
    return { status: 'needs_review' as const };
  }

  await profileRepo.updateProfile(userId, {
    nome: result.nome,
    situacao: 'student',
    cursoId: result.cursoId,
    numeroProcesso,
  });

  return { status: 'upgraded' as const };
}