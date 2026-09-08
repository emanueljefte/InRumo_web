export type NotificationType =
  | 'sessao_marcada' | 'sessao_cancelada' | 'chat_escalado' | 'chat_resposta_orientador'
  | 'matricula_aprovada' | 'matricula_rejeitada';

export type AppNotification = {
  id: string;
  userId: string;
  tipo: NotificationType;
  conteudo: string;
  lida: boolean;
  createdAt: string;
};