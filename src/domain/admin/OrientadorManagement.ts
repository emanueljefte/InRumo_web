export type OrientadorSummary = {
  id: string;
  nome: string;
  email: string;
  especialidade: string | null;
  tempPassword?: string;
};

export type CreateOrientadorInput = {
  nome: string;
  email: string;
  especialidade: string;
  tempPassword?: string;
};