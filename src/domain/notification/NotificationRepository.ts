import type { AppNotification, NotificationType } from "./Notification";

export type NotificationRepository = {
  create(userId: string, tipo: NotificationType, conteudo: string): Promise<void>;
  getForUser(userId: string): Promise<AppNotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  subscribeToNew(userId: string, onNotification: (n: AppNotification) => void): () => void;
};