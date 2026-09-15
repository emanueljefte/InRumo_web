import type { CourseId } from "../test/TestQuestion";

export type EscalatedChat = {
  id: string;
  userId: string;
  userNome: string;
  cursoId: CourseId | null;
  areaNome: string | null;
  lastMessage: string;
  updatedAt: string;
};

export type ChatModerationRepository = {
  getEscalatedChats(): Promise<EscalatedChat[]>; // qualquer orientador vê qualquer escalada; sem atribuição individual por agora
};