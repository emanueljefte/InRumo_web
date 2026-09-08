import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Menu, 
  User, 
  X, 
  Home, 
  Award, 
  MessageSquare, 
  BookOpen, 
  ChevronDown, 
  Sparkles,
  Loader2 
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const CANDIDATE_NAV_ITEMS: NavItem[] = [
  { to: '/candidate', label: 'Início', icon: Home },
  { to: '/candidate/results', label: 'Resultados', icon: Award },
  { to: '/candidate/chat', label: 'Orientador IA', icon: MessageSquare },
  { to: '/course', label: 'Cursos', icon: BookOpen },
];

export default function CandidateTopNavLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloqueia o scroll da página quando o menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/landingpage', { replace: true });
    } catch (error) {
      console.error('Erro ao terminar sessão:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Iniciais do utilizador para o Avatar
  const getUserInitials = () => {
    const name = profile?.nome || profile?.email || 'Candidato';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getUserDisplayName = () => {
    return profile?.nome || profile?.email?.split('@')[0] || 'Candidato';
  };

  return (
    <div className="min-h-screen bg-[#fbf8ff] font-body text-[#1a1b22] antialiased flex flex-col">
      {/* ================= HEADER PRINCIPAL ================= */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#e8e7f1] sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-8">
            <NavLink 
              to="/candidate" 
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-1"
            >
              <div className="bg-primary/10 w-9 h-9 rounded-xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <img src="/favicon_2.png" alt="InRumo" className="h-5 w-auto" />
              </div>
              <span className="font-heading font-bold text-lg text-[#1a1b22] tracking-tight">
                InRumo
              </span>
            </NavLink>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {CANDIDATE_NAV_ITEMS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/candidate'}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-primary/10 text-primary shadow-xs'
                        : 'text-[#504536] hover:text-[#1a1b22] hover:bg-gray-100/70'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{label}</span>
                      {to === '/candidate/chat' && (
                        <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                          isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          AI
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Perfil e Ações Desktop */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Tag do Perfil Activo */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Candidato INSTIC</span>
            </div>

            {/* Menu Dropdown do Utilizador */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/80 transition-all border border-transparent hover:border-[#e8e7f1] focus:outline-none"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  {getUserInitials()}
                </div>
                <span className="text-xs font-semibold text-[#1a1b22] max-w-[120px] truncate">
                  {getUserDisplayName()}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#827564] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu Flutuante */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e8e7f1] py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-[#e8e7f1]/60">
                    <p className="text-[11px] font-medium text-[#827564]">Sessão iniciada como</p>
                    <p className="text-xs font-bold text-[#1a1b22] truncate">{profile?.email}</p>
                  </div>

                  <div className="p-1">
                    <NavLink
                      to="/candidate/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#504536] hover:text-[#1a1b22] hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-[#827564]" />
                      <span>O meu Perfil</span>
                    </NavLink>
                  </div>

                  <div className="p-1 border-t border-[#e8e7f1]/60">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão de Hambúrguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-[#1a1b22] hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= DRAWER MOBILE ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in-50 duration-200">
          {/* Overlay Escuro */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
            onClick={() => setMobileMenuOpen(false)} 
          />

          {/* Painel Lateral */}
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-250">
            <div>
              {/* Cabeçalho do Drawer */}
              <div className="flex justify-between items-center pb-5 border-b border-[#e8e7f1]">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center border border-primary/20">
                    <img src="/favicon_2.png" alt="InRumo" className="h-4 w-auto" />
                  </div>
                  <span className="font-heading font-bold text-base text-[#1a1b22]">InRumo</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#827564] hover:bg-gray-100 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card do Perfil no Mobile */}
              <div className="mt-5 p-3.5 rounded-2xl bg-surface-container-high/60 border border-[#e8e7f1] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center shadow-xs shrink-0">
                  {getUserInitials()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1a1b22] truncate">{getUserDisplayName()}</p>
                  <p className="text-[11px] text-[#827564] truncate">{profile?.email}</p>
                </div>
              </div>

              {/* Lista de Navegação Mobile */}
              <nav className="mt-6 flex flex-col gap-1.5">
                {CANDIDATE_NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/candidate'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-[#504536] hover:bg-gray-100/80 hover:text-[#1a1b22]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {to === '/candidate/chat' && (
                      <Sparkles className="w-3.5 h-3.5 opacity-80" />
                    )}
                  </NavLink>
                ))}

                <div className="my-2 border-t border-[#e8e7f1]" />

                <NavLink
                  to="/candidate/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-[#504536] hover:bg-gray-100/80 hover:text-[#1a1b22]'
                    }`
                  }
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>O meu Perfil</span>
                </NavLink>
              </nav>
            </div>

            {/* Rodapé do Drawer - Logout */}
            <div className="pt-4 border-t border-[#e8e7f1]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>Terminar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTEÚDO PRINCIPAL (PAGE CONTENT) ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}