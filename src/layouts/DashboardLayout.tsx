import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
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
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/tests', label: 'Testes', icon: ClipboardList },
  { to: '/results', label: 'Resultados', icon: BarChart3 },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/schedule', label: 'Sessões', icon: Calendar },
  { to: '/documents', label: 'Documentos', icon: FileText },
];

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col md:flex-row font-sans text-[#1a1b22] antialiased">
      {/* ================= HEADER MOBILE ================= */}
      <header className="md:hidden bg-[#fbf8ff] border-b border-[#e8e7f1] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c9932e] flex items-center justify-center text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-[#1a1b22]">InRumo</span>
            <p className="text-[10px] text-[#827564] leading-none">Vocational Guidance</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-[#827564] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* BACKDROP MOBILE */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR (DESKTOP & MOBILE DRAWER) ================= */}
      <aside
        className={`
          fixed md:static top-0 left-0 bottom-0 z-50
          bg-[#fbf8ff] border-r border-[#e8e7f1] p-4 sm:p-5 flex flex-col justify-between
          transition-all duration-300 ease-in-out shrink-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64
        `}
      >
        <div>
          {/* LOGO E BOTÃO DE ENCOLHER */}
          <div className={`flex items-center mb-8 px-1 h-12 transition-all ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#c9932e] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-lg text-[#1a1b22] tracking-tight leading-tight">
                    InRumo
                  </span>
                  <span className="text-[11px] text-[#827564] font-medium leading-none">
                    Vocational Guidance
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 text-[#827564] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-lg transition-colors border border-[#e8e7f1] shrink-0"
              title={isCollapsed ? 'Expandir menu' : 'Encolher menu'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* NAVEGAÇÃO PRINCIPAL */}
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#f4f2fd] text-[#7e5700] font-semibold border-r-4 border-[#7e5700] rounded-r-none'
                      : 'text-[#504536] hover:bg-[#eeedf7]/60 hover:text-[#1a1b22]'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />

                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate">{label}</span>
                )}

                {isCollapsed && !isMobileOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1b22] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-md z-50">
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM: PERFIL */}
        <div className="pt-4 border-t border-[#e8e7f1]">
          <NavLink
            to="/profile"
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#f4f2fd] text-[#7e5700] font-semibold'
                  : 'text-[#504536] hover:bg-[#eeedf7]/60 hover:text-[#1a1b22]'
              }`
            }
          >
            <User size={18} className="shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="truncate font-medium">Perfil</span>}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1b22] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-md z-50">
                Perfil
              </div>
            )}
          </NavLink>
        </div>
      </aside>

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}