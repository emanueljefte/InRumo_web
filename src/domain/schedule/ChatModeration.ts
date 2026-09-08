export type EscalatedChat = {
  id: string;
  userId: string;
  userNome: string;
  lastMessage: string;
  updatedAt: string;
};

export type ChatModerationRepository = {
  getEscalatedChats(): Promise<EscalatedChat[]>; // qualquer orientador vê qualquer escalada; sem atribuição individual por agora
};