import { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react';

export default function PublicLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf8ff] font-body text-[#1a1b22] antialiased flex flex-col">
      {/* ================= HEADER / NAVEGAÇÃO ================= */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#e8e7f1] sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <NavLink to="/landingpage" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
              <div className="w-4 h-4 rounded-full border-2 border-primary group-hover:border-white flex items-center justify-center relative transition-colors">
                <span className="w-1 h-1 bg-primary group-hover:bg-white rounded-full transition-colors" />
              </div>
            </div>
            <span className="font-heading text-xl font-bold text-[#1a1b22] tracking-tight">
              InRumo
            </span>
          </NavLink>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-[#504536] hover:text-primary px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Iniciar sessão
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Criar conta
            </button>
            <button
              onClick={() => navigate('/test')}
              className="flex items-center gap-2 bg-primary text-on-primary text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 shadow-md hover:shadow-primary/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Começar Teste Vocacional</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-[#1a1b22] hover:bg-black/5 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ================= DRAWER / MENU MOBILE ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay Escuro */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel Lateral */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Cabeçalho Drawer */}
              <div className="flex justify-between items-center pb-4 border-b border-[#e8e7f1]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-heading text-lg font-bold text-[#1a1b22]">InRumo</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/test');
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary font-bold text-sm py-3 rounded-xl shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Fazer Teste Vocacional</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-[#1a1b22] font-semibold text-sm py-3 rounded-xl border border-[#e8e7f1] transition-colors cursor-pointer"
                >
                  Iniciar sessão
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full text-primary font-semibold text-sm py-2.5 transition-colors cursor-pointer"
                >
                  Criar uma nova conta
                </button>
              </div>
            </div>

            {/* Mensagem Rodapé Mobile */}
            <div className="text-center text-[11px] text-[#827564] pt-4 border-t border-[#e8e7f1]">
              Orientação vocacional universitária para o INSTIC.
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      {/* ================= RODAPÉ INSTITUCIONAL ================= */}
      <footer className="bg-white border-t border-[#e8e7f1] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#504536]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1a1b22]">InRumo</span>
            <span>— Instituto Superior de Tecnologias de Informação e Comunicação</span>
          </div>
          <p>© {new Date().getFullYear()} InRumo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}