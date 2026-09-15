import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  MessageCircle,
  Calendar,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Compass,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../application/auth/useAuth';
import { NotificationBell } from '../presentation/shared/NotificationBell';

const NAV_ITEMS = [
  { to: '/student', label: 'Início', icon: Home },
  { to: '/student/results', label: 'Resultado', icon: BarChart3 },
  { to: '/student/schedule', label: 'Agendar', icon: Calendar },
  { to: '/student/documents', label: 'Documentos', icon: FileText },
  { to: '/student/chat', label: 'Orientador', icon: MessageCircle },
];

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { profile, signOut } = useAuth();
  const location = useLocation();

  const currentNavItem = NAV_ITEMS.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );
  const currentPageTitle = currentNavItem?.label ?? 'Perfil & Configurações';

  return (
    <div className="h-screen w-full bg-surface-container-lowest/60 flex flex-col md:flex-row font-sans text-on-surface antialiased overflow-hidden">

      {/* ================= HEADER MOBILE ================= */}
      <header className="md:hidden bg-surface-container-lowest border-b border-outline-variant/50 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <img src="/favicon_2.png" alt="" />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-on-surface tracking-tight">InRumo</span>
            <p className="text-[10px] text-on-surface-variant leading-none font-medium">Orientação Vocacional</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
            aria-label={isMobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* BACKDROP MOBILE */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-on-surface/20 backdrop-blur-xs z-40 md:hidden transition-opacity animate-fadeIn"
        />
      )}

      {/* ================= SIDEBAR FIXA (DESKTOP & MOBILE DRAWER) ================= */}
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
                className="group relative w-10 h-10 rounded-2xl bg-primary/10 text-on-primary flex items-center justify-center shrink-0 shadow-xs hover:opacity-90 transition-all cursor-pointer"
                title="Expandir menu"
              >
                <img src="/favicon_2.png" className=" shrink-0 transition-transform group-hover:scale-90" alt="" />
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
                    <span className="text-[11px] text-on-surface-variant font-medium leading-none truncate">
                      Plataforma Acadêmica
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

          {/* NAVEGAÇÃO PRINCIPAL (Com rolagem própria se a altura vertical for pequena) */}
          <nav className="flex flex-col gap-1.5 overflow-y-auto flex-1 pr-0.5 custom-scrollbar">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/student'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${isActive
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

                    {isActive && isCollapsed && !isMobileOpen && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full" />
                    )}

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

        {/* BOTTOM: PERFIL E LOGOUT (Fixos no rodapé da sidebar) */}
        <div className="pt-4 border-t border-outline-variant/40 space-y-2 shrink-0">
          <NavLink
            to="/student/profile"
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${isActive
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-surface-container-low text-on-surface'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`
            }
          >
            <div className="w-8 h-8 rounded-xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center font-bold text-xs text-primary shrink-0">
              {profile?.nome ? profile.nome.charAt(0).toUpperCase() : <User size={16} />}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-on-surface truncate">
                  {profile?.nome ?? 'Estudante'}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate">
                  Ver Perfil
                </span>
              </div>
            )}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-on-surface text-surface-container-lowest text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-lg z-[60]">
                Perfil do Estudante
              </div>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() => signOut?.()}
            className={`group relative w-full flex items-center gap-3 py-2.5 rounded-2xl text-xs font-medium text-error hover:bg-error/10 transition-colors cursor-pointer ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3.5'
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

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL (COM ROLAGEM INDEPENDENTE) ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Topbar Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-outline-variant/30 bg-surface-container-lowest/40 backdrop-blur-md shrink-0">
          <div>
            <h2 className="font-heading font-bold text-lg text-on-surface tracking-tight">
              {currentPageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">

            <NotificationBell />

            <div className="h-4 w-px bg-outline-variant/50" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Sparkles size={14} />
              <span>Modo Orientativo</span>
            </div>
          </div>
        </header>

        {/* ÁREA ROLÁVEL PRINCIPAL (Toda página filha rola aqui dentro) */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}