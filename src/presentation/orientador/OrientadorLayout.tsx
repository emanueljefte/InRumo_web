import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  MessageCircle,
  Calendar,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  Bell,
  Sparkles,
  UserCheck
} from 'lucide-react';
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
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/landingpage', { replace: true });
  };

  const currentNavItem = ORIENTADOR_NAV_ITEMS.find((item) =>
    item.to === '/orientador'
      ? location.pathname === '/orientador'
      : location.pathname.startsWith(item.to)
  );
  const currentPageTitle = currentNavItem?.label ?? 'Painel de Orientação';

  return (
    <div className="h-screen w-full bg-surface-container-lowest/60 flex flex-col md:flex-row font-body text-on-surface antialiased overflow-hidden">
      
      {/* ================= HEADER MOBILE ================= */}
      <header className="md:hidden bg-surface-container-lowest border-b border-outline-variant/50 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-on-surface tracking-tight">InRumo</span>
            <p className="text-[10px] text-on-surface-variant leading-none font-medium">Área do Orientador</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
          aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* BACKDROP MOBILE */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-on-surface/20 backdrop-blur-xs z-40 md:hidden transition-opacity animate-fadeIn"
        />
      )}

      {/* ================= SIDEBAR FIXA ================= */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-screen z-50
          bg-surface-container-lowest border-r border-outline-variant/50 p-3 sm:p-4 flex flex-col justify-between
          transition-all duration-300 ease-in-out shrink-0 shadow-lg md:shadow-none select-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64
        `}
      >
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
          
          {/* LOGO E BOTÃO DE RECOLHER */}
          <div className={`flex items-center px-1 h-12 shrink-0 mb-6 transition-all duration-300 ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'}`}>
            {isCollapsed && !isMobileOpen ? (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="group relative w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs hover:opacity-90 transition-all cursor-pointer"
                title="Expandir menu"
              >
                <Compass className="w-5 h-5 shrink-0 transition-transform group-hover:scale-90" />
                <div className="absolute inset-0 rounded-2xl bg-on-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={18} className="text-on-primary" />
                </div>
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg z-[60]">
                  Expandir InRumo
                </div>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                    <Compass className="w-5 h-5 shrink-0" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading font-bold text-lg text-on-surface tracking-tight leading-tight truncate">
                      InRumo
                    </span>
                    <span className="text-[11px] text-primary font-bold leading-none truncate">
                      Painel Orientador
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="hidden md:flex p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors border border-outline-variant/40 shrink-0 cursor-pointer"
                  title="Recolher menu"
                >
                  <ChevronLeft size={16} />
                </button>
              </>
            )}
          </div>

          {/* NAVEGAÇÃO PRINCIPAL */}
          <nav className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5 custom-scrollbar">
            {ORIENTADOR_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/orientador'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />

                    {(!isCollapsed || isMobileOpen) && (
                      <span className="truncate">{label}</span>
                    )}

                    {/* Indicador de item ativo no modo recolhido */}
                    {isActive && isCollapsed && !isMobileOpen && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full" />
                    )}

                    {/* Tooltip Hover no modo recolhido */}
                    {isCollapsed && !isMobileOpen && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg z-[60]">
                        {label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM: PERFIL DO ORIENTADOR E SAIR */}
        <div className="pt-4 border-t border-outline-variant/40 space-y-2 shrink-0">
          
          {/* Card de Identificação */}
          <div
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all hover:bg-surface-container-low ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
              {profile?.nome ? profile.nome.charAt(0).toUpperCase() : <UserCheck size={16} />}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-on-surface truncate">
                  {profile?.nome ?? 'Orientador'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Disponível
                </span>
              </div>
            )}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg z-[60]">
                {profile?.nome ?? 'Perfil do Orientador'}
              </div>
            )}
          </div>

          {/* Botão de Terminar Sessão */}
          <button
            type="button"
            onClick={handleLogout}
            className={`group relative w-full flex items-center gap-3 py-2.5 rounded-2xl text-xs font-medium text-error hover:bg-error/10 transition-colors cursor-pointer ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3.5'
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            
            {(!isCollapsed || isMobileOpen) && (
              <span>Sair da conta</span>
            )}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-error text-on-primary text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg z-[60]">
                Sair da conta
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-outline-variant/30 bg-surface-container-lowest/40 backdrop-blur-md shrink-0">
          <div>
            <h2 className="font-heading font-bold text-lg text-on-surface tracking-tight">
              {currentPageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors relative cursor-pointer"
              title="Notificações"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>

            <div className="h-4 w-px bg-outline-variant/50" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Sparkles size={14} />
              <span>Sessão Ativa</span>
            </div>
          </div>
        </header>

        {/* ÁREA ROLÁVEL PRINCIPAL */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}