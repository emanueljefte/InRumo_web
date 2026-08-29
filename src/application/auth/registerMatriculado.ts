import type { AdmissionVerificationRepository } from "../../domain/auth/AdmissionVerification";
import type { AuthRepository } from "../../domain/auth/AuthRepository";
import type { EnrollmentDocumentRepository } from "../../domain/auth/EnrollmentDocumentRepository";
import type { CourseId } from "../../domain/test/TestQuestion";
import { normalizeName } from "./normalizeName";

// application/auth/registerMatriculado.ts — envolvido em try/catch, com falha recuperável
export type RegisterMatriculadoResult =
  | { status: 'verified' }
  | { status: 'pending' }
  | { status: 'needs_document' }
  | { status: 'account_created_needs_retry'; userId: string }; // signUp ok, resto falhou

export async function registerMatriculado(
  input: { nome: string; email: string; senha: string; numeroProcesso: string; cursoId: CourseId; documento?: File },
  authRepository: AuthRepository,
  admissionRepo: AdmissionVerificationRepository,
  documentRepo: EnrollmentDocumentRepository,
): Promise<RegisterMatriculadoResult> {
  const { userId } = await authRepository.signUp({ nome: input.nome, email: input.email, senha: input.senha });
  // se signUp falhar, o erro propaga normalmente — nada foi criado, sem estado a limpar

  try {
    return await completeMatriculadoVerification(userId, input, admissionRepo, documentRepo);
  } catch {
    // conta já existe, mas a parte de verificação falhou — não é um erro para descartar tudo
    return { status: 'account_created_needs_retry', userId };
  }
}

// extraído para ser reutilizável no login/retry, sem precisar de signUp de novo
export async function completeMatriculadoVerification(
  userId: string,
  input: { nome: string; numeroProcesso: string; cursoId: CourseId; documento?: File },
  admissionRepo: AdmissionVerificationRepository,
  documentRepo: EnrollmentDocumentRepository,
): Promise<RegisterMatriculadoResult> {
  const verification = await admissionRepo.verify(input.numeroProcesso);

  if (verification.matched && normalizeName(verification.nome) === normalizeName(input.nome)) {
    await documentRepo.updateProfileVerification(userId, {
      situacao: 'matriculado',
      cursoId: verification.cursoId,
      numeroProcesso: input.numeroProcesso,
      verificationStatus: 'verified',
    });
    return { status: 'verified' };
  }

  if (!input.documento) {
    return { status: 'needs_document' };
  }

  await documentRepo.uploadDocument(userId, input.documento);
  await documentRepo.updateProfileVerification(userId, {
    situacao: 'matriculado',
    cursoId: input.cursoId,
    numeroProcesso: input.numeroProcesso,
    verificationStatus: 'pending',
  });
  return { status: 'pending' };
}