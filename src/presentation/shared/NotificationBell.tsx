import { useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../application/notification/useNotifications';
import { SupabaseNotificationRepository } from '../../data/supabase/SupabaseNotificationRepository';

export function NotificationBell() {
  const notificationRepository = useMemo(() => new SupabaseNotificationRepository(), []);
  const { notifications, unreadCount, markAsRead } = useNotifications(notificationRepository);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 text-on-surface-variant hover:text-primary relative" aria-label="Notificações">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-lg p-2 max-h-96 overflow-y-auto z-50">
          {notifications.length === 0 ? (
            <p className="font-body-sm text-on-surface-variant text-center py-6">Sem notificações.</p>
          ) : (
            notifications.map((n) => (
              <button key={n.id} onClick={() => markAsRead(n.id)}
                className={`w-full text-left p-3 rounded-xl text-xs ${n.lida ? 'text-on-surface-variant' : 'text-on-surface font-medium bg-primary-container/10'}`}>
                {n.conteudo}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}