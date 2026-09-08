import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import type { NotificationRepository } from '../../domain/notification/NotificationRepository';
import type { AppNotification } from '../../domain/notification/Notification';

export function useNotifications(notificationRepository: NotificationRepository) {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!session) return;
    const currentSession = session;

    notificationRepository.getForUser(currentSession.user.id).then(setNotifications);

    return notificationRepository.subscribeToNew(currentSession.user.id, (n) =>
      setNotifications((prev) => [n, ...prev])
    );
  }, [session, notificationRepository]);

  const unreadCount = notifications.filter((n) => !n.lida).length;

  const markAsRead = async (id: string) => {
    await notificationRepository.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, lida: true } : n)));
  };

  return { notifications, unreadCount, markAsRead };
}