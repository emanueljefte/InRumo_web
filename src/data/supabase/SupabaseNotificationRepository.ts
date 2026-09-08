import { supabase } from '../../api/supabase';
import type { AppNotification, NotificationType } from '../../domain/notification/Notification';
import type { NotificationRepository, } from '../../domain/notification/NotificationRepository';

type NotificationRow = { id: string; user_id: string; tipo: NotificationType; conteudo: string; lida: boolean; created_at: string };

function mapNotification(r: NotificationRow): AppNotification {
  return { id: r.id, userId: r.user_id, tipo: r.tipo, conteudo: r.conteudo, lida: r.lida, createdAt: r.created_at };
}

export class SupabaseNotificationRepository implements NotificationRepository {
  async create(userId: string, tipo: NotificationType, conteudo: string) {
    const { error } = await supabase.from('notifications').insert({ user_id: userId, tipo, conteudo });
    if (error) throw error;
  }

  async getForUser(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw error;
    return (data as NotificationRow[]).map(mapNotification);
  }

  async markAsRead(notificationId: string) {
    const { error } = await supabase.from('notifications').update({ lida: true }).eq('id', notificationId);
    if (error) throw error;
  }

  subscribeToNew(userId: string, onNotification: (n: AppNotification) => void) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on<NotificationRow>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => onNotification(mapNotification(payload.new))
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }
}