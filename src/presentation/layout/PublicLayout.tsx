import { useState } from 'react';
import { Outlet, useNavigate, NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, UserCheck, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { getHomeRoute } from '../../application/auth/getHomeRoute';

const NAV_ITEMS = [
  { to: '/landingpage#cursos', label: 'Cursos' },
  { to: '/landingpage#metodologia', label: 'Metodologia' },
  { to: '/landingpage#sobre', label: 'O INSTIC' },
  { to: '/landingpage#matriculados', label: 'Matriculados' },
];

export default function PublicLayout() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigateToHome = () => {
    setMobileMenuOpen(false);
    navigate(getHomeRoute(profile));
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background antialiased flex flex-col selection:bg-primary/20">

      {/* ================= HEADER / NAVBAR ================= */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-outline-variant/40 sticky top-0 z-50 transition-all">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center h-20">

          {/* Logo */}
          <NavLink
            to="/landingpage"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-102"
          >
            <img src="/favicon_2.png" alt="Logo InRumo" className="h-9 w-auto object-contain" />
            <span className="font-heading font-bold text-lg text-on-surface tracking-tight">
              In<span className="text-primary">Rumo</span>
            </span>
          </NavLink>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/40 rounded-2xl p-1.5 pl-4">
                <span className="text-xs font-bold text-on-surface max-w-30 truncate">
                  {profile?.nome ?? 'Minha Conta'}
                </span>
                <button
                  type="button"
                  onClick={handleNavigateToHome}
                  className="bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded-xl hover:opacity-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck size={14} />
                  <span>Painel</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs font-bold text-on-surface-variant hover:text-on-surface px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn size={15} />
                  <span>Entrar</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/test')}
                  className="bg-primary text-on-primary font-bold text-xs px-5 py-2.5 rounded-2xl hover:opacity-95 transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Começar Teste</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>

          {/* Botão do Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-on-surface hover:text-primary transition-colors cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================= DRAWER / MENU MOBILE ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          {/* Backdrop Escuro */}
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel Deslizante */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-surface-container-lowest shadow-2xl p-6 flex flex-col justify-between border-l border-outline-variant/40">

            <div className="space-y-8">
              {/* Topo do Drawer */}
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-2">
                  <img src="/favicon_2.png" alt="Logo InRumo" className="h-8 w-auto" />
                  <span className="font-heading font-bold text-base text-on-surface">InRumo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links de Navegação Mobile */}
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-on-surface hover:text-primary p-3 rounded-2xl hover:bg-surface-container-low transition-colors">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Ações Inferiores no Mobile */}
            <div className="border-t border-outline-variant/30 pt-6 space-y-3">
              {session ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/40">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Sessão Iniciada
                    </p>
                    <p className="text-xs font-bold text-on-surface truncate">
                      {profile?.nome ?? 'Usuário'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNavigateToHome}
                    className="w-full bg-primary text-on-primary font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <UserCheck size={16} />
                    <span>Voltar ao Painel</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full border border-outline-variant/50 text-on-surface font-bold text-xs py-3 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    Entrar na Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/test');
                    }}
                    className="w-full bg-primary text-on-primary font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Sparkles size={16} />
                    <span>Começar Teste Vocacional</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <main className="flex-1 max-w-container-max mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      {/* ================= RODAPÉ (FOOTER) ================= */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/40 py-8 mt-auto">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">

          <div className="flex items-center gap-2">
            <img src="/favicon_2.png" alt="Logo InRumo" className="h-6 w-auto opacity-80" />
            <span className="text-xs font-bold text-on-surface">
              Plataforma de Orientação Vocacional INSTIC
            </span>
          </div>

          <p className="text-xs text-on-surface-variant font-medium">
            © 2026 InRumo. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}