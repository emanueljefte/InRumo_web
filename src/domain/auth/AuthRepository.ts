export type SignUpInput = { nome: string; email: string; senha: string };
export type SignInInput = { email: string; senha: string };

export type AuthRepository = {
  signUp(input: SignUpInput): Promise<{ userId: string }>;
  signIn(input: SignInInput): Promise<void>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(novaSenha: string): Promise<void>;
};