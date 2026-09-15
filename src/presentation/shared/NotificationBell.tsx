import { useMemo, useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { useNotifications } from '../../application/notification/useNotifications';
import { SupabaseNotificationRepository } from '../../data/supabase/SupabaseNotificationRepository';

export function NotificationBell() {
  const notificationRepository = useMemo(() => new SupabaseNotificationRepository(), []);
  const { notifications, unreadCount, markAsRead } = useNotifications(notificationRepository);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Retrair dropdown ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Botão do Sino */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-95 cursor-pointer"
        aria-label="Notificações"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />

        {/* 2. Ponto Amarelado / Contador apenas se houver notificações não lidas */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white" />
          </span>
        )}
      </button>

      {/* Popover / Dropdown de Notificações */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          {/* Cabeçalho */}
          <div className="p-3.5 px-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Notificações</h3>
              {unreadCount > 0 && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                </span>
              )}
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4 space-y-2">
                <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-slate-500">Sem notificações no momento.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markAsRead(n.id)}
                  className={`w-full text-left p-3.5 transition-all duration-150 flex items-start gap-3 hover:bg-slate-50/80 cursor-pointer ${
                    n.lida ? 'opacity-65 bg-white' : 'bg-indigo-50/30'
                  }`}
                >
                  {/* Indicador lateral para não lidas */}
                  {!n.lida && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed break-words ${n.lida ? 'text-slate-600 font-normal' : 'text-slate-900 font-semibold'}`}>
                      {n.conteudo}
                    </p>
                  </div>

                  {n.lida && (
                    <CheckCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}