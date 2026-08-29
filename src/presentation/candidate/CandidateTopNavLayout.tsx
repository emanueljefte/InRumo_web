import { LogOut, Menu, User, X } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../application/auth/useAuth";
import { useState } from "react";

const CANDIDATE_NAV_ITEMS = [
  { to: '/candidate', label: 'Início' },
  { to: '/candidate/results', label: 'Resultado' },
  { to: '/candidate/chat', label: 'Orientador IA' },
  { to: '/candidate/course', label: 'Cursos' },
];

export default function CandidateTopNavLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/landingpage', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-background antialiased">
      <header className="bg-background/90 backdrop-blur-md border-b border-outline-variant/60 sticky top-0 z-50">
        <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg flex justify-between items-center h-16">
          <NavLink to="/candidate" className="flex items-center gap-2">
            <img src="/favicon_2.png" alt="Logo do InRumo" className="h-8" />
          </NavLink>

          <nav className="hidden md:flex items-center gap-8">
            {CANDIDATE_NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/candidate'}
                className={({ isActive }) =>
                  `font-body-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/candidate/profile" className="text-on-surface-variant hover:text-primary transition-colors">
              <User className="w-5 h-5" />
            </NavLink>
            <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors" aria-label="Sair">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-on-surface" aria-label="Abrir menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-surface-container-lowest shadow-lg p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <img src="/favicon_2.png" alt="Logo do InRumo" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
                <X className="w-5 h-5 text-on-surface" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {CANDIDATE_NAV_ITEMS.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/candidate'} onClick={() => setMobileMenuOpen(false)} className="font-body-md text-on-surface font-medium">
                  {label}
                </NavLink>
              ))}
              <NavLink to="/candidate/profile" onClick={() => setMobileMenuOpen(false)} className="font-body-md text-on-surface font-medium">
                Perfil
              </NavLink>
            </nav>

            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="mt-auto border font-medium px-5 py-3 rounded-lg text-error border-error/40"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      <main className="max-w-container-max mx-auto px-gutter md:px-stack-lg py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}