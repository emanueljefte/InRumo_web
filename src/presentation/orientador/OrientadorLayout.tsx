// presentation/orientador/OrientadorLayout.tsx
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Calendar, Clock, LogOut, Menu, X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';

const ORIENTADOR_NAV_ITEMS = [
  { to: '/orientador', label: 'Início', icon: Home },
  { to: '/orientador/chats', label: 'Conversas', icon: MessageCircle },
  { to: '/orientador/sessions', label: 'Sessões', icon: Calendar },
  { to: '/orientador/availability', label: 'Disponibilidade', icon: Clock },
];

export default function OrientadorLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/landingpage', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-body text-on-background antialiased">
      <header className="md:hidden bg-background border-b border-surface-container-high px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-tertiary flex items-center justify-center text-white">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-base text-on-background">InRumo</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-outline hover:text-on-background hover:bg-surface-container rounded-lg" aria-label="Abrir menu">
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {isMobileOpen && <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden" />}

      <aside className={`fixed md:static top-0 left-0 bottom-0 z-50 bg-background border-r border-surface-container-high p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}>
        <div>
          <div className={`flex items-center mb-8 px-1 h-12 ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-tertiary flex items-center justify-center text-white shrink-0 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              {(!isCollapsed || isMobileOpen) && <span className="font-heading font-bold text-lg text-on-background tracking-tight">InRumo</span>}
            </div>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex p-1.5 text-outline hover:text-on-background hover:bg-surface-container rounded-lg border border-surface-container-high shrink-0">
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="flex flex-col gap-1.5">
            {ORIENTADOR_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/orientador'} onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 ${
                  isActive ? 'bg-surface-container text-tertiary font-semibold border-r-4 border-tertiary rounded-r-none' : 'text-on-surface-variant hover:bg-surface-container/60 hover:text-on-background'
                }`}>
                <Icon size={18} className="shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container/60 hover:text-error transition-all border-t border-surface-container-high pt-4">
          <LogOut size={18} className="shrink-0" />
          {(!isCollapsed || isMobileOpen) && <span>Sair</span>}
        </button>
      </aside>

      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}