import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileCheck, Upload, LogOut, Menu, X, ChevronLeft, ChevronRight, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';

const ADMIN_NAV_ITEMS = [
  { to: '/admin/enrollments', label: 'Comprovativos', icon: FileCheck },
  { to: '/admin/import-admitted', label: 'Importar Admitidos', icon: Upload },
  { to: '/admin/orientadores', label: 'Orientadores', icon: Users }
];

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro ao terminar sessão:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-body text-on-background antialiased">
      
      {/* ================= HEADER MOBILE ================= */}
      <header className="md:hidden bg-surface border-b border-outline-variant/40 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center text-on-primary shadow-xs">
            <img src='/favicon_2.png' alt='Logo do InRumo' className="w-7 h-7" />
          </div>
          <span className="font-heading font-bold text-base text-on-surface">InRumo Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-on-surface-variant hover:bg-surface rounded-xl transition-colors cursor-pointer"
          aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Overlay para fechar menu no mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR DESKTOP & MOBILE ================= */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 bg-surface border-r border-outline-variant/40 p-4 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        <div className="space-y-6">
          {/* Logo & Botão de Recolher */}
          <div className={`flex items-center px-1 h-12 ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-xs">
                <img src='/favicon_2.png' alt='Logo do InRumo' className="w-7 h-7" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-base text-surface tracking-tight leading-none">InRumo</span>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider mt-0.5">Painel Admin</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 text-surface hover:bg-surface hover:text-on-surface rounded-xl border border-outline-variant/40 shrink-0 transition-colors cursor-pointer"
              aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navegação Principal */}
          <nav className="flex flex-col gap-1.5">
            {ADMIN_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed && !isMobileOpen ? label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-surface-variant hover:bg-surface-container-low hover:text-primary'
                  } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-primary' : ''}`} />
                    {(!isCollapsed || isMobileOpen) && <span className="truncate">{label}</span>}
                    {isActive && (
                      <div className="absolute right-0 top-2 bottom-2 w-1 bg-primary rounded-l-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Info do Utilizador e Logout */}
        <div className="space-y-3 pt-4 border-t border-outline-variant/40">
          {/* Card Resumido do Administrador */}
          {(!isCollapsed || isMobileOpen) && profile && (
            <div className="px-3 py-2.5 rounded-2xl bg-surface-container-low/60 flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {profile.email?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">Administrador</span>
                <span className="text-[10px] text-on-surface-variant truncate">{profile.email}</span>
              </div>
            </div>
          )}

          {/* Botão Sair */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isCollapsed && !isMobileOpen ? 'Sair da Conta' : undefined}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold text-error hover:bg-error/10 transition-all cursor-pointer disabled:opacity-50 ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="shrink-0 animate-spin" />
            ) : (
              <LogOut size={18} className="shrink-0" />
            )}
            {(!isCollapsed || isMobileOpen) && <span>Sair da Conta</span>}
          </button>
        </div>
      </aside>

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL ================= */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto min-w-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}