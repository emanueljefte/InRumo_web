export type OrientadorSummary = {
  id: string;
  nome: string;
  email: string;
  especialidade: string | null;
};

export type CreateOrientadorInput = {
  nome: string;
  email: string;
  especialidade: string;
};