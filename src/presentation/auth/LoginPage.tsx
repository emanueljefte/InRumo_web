import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';

export default function LoginPage() {
  const navigate = useNavigate();
  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authRepository.signIn({ email, senha });
      navigate('/', { replace: true }); // Splash/rota raiz decide candidate vs student
    } catch {
      setError('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fbf8ff] antialiased">
      {/* ================= LADO ESQUERDO: Painel Institucional ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Imagem de Fundo com Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 filter brightness-[0.98] contrast-[0.95]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        {/* Soft Overlay sutil fiel ao design */}
        <div className="absolute inset-0 bg-linear-to-t from-[#fbf8ff]/90 via-[#fbf8ff]/40 to-[#fbf8ff]/60 z-10" />

        {/* Card em Perspectiva no Fundo (Efeito da Imagem) */}
        <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-80 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-6 shadow-xl z-10 pointer-events-none opacity-40 blur-[0.5px]">
          <div className="space-y-4">
            <div className="h-8 bg-white/60 rounded-lg w-3/4" />
            <div className="h-10 bg-white/60 rounded-xl w-full" />
            <div className="h-10 bg-white/60 rounded-xl w-full" />
            <div className="h-12 bg-primary/60 rounded-xl w-full" />
          </div>
        </div>

        {/* Logo Flutuante Superior */}
        <div className="relative z-20">
          <div className="bg-white/90 backdrop-blur-md w-16 h-16 rounded-xl p-3 shadow-sm border border-white/60 flex items-center justify-center">
            {/* Logo do InRumo */}
            <div className="flex flex-col items-center justify-center text-primary">
              <div className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center relative">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                <div className="absolute -top-1 w-0.5 h-1.5 bg-primary" />
                <div className="absolute -bottom-1 w-0.5 h-1.5 bg-primary" />
                <div className="absolute -left-1 h-0.5 w-1.5 bg-primary" />
                <div className="absolute -right-1 h-0.5 w-1.5 bg-primary" />
              </div>
              <span className="text-[8px] font-bold tracking-tight text-[#1a1b22] mt-0.5">InRumo</span>
            </div>
          </div>
        </div>

        {/* Conteúdo do Texto Inferior */}
        <div className="relative z-20 max-w-lg mb-4">
          <h1 className="font-heading text-4xl xl:text-[42px] leading-[1.15] font-bold text-[#1a1b22] tracking-tight mb-4">
            O seu futuro em foco.
          </h1>
          <p className="font-body text-base text-[#504536] leading-relaxed max-w-md">
            Bem-vindo à InRumo. O seu guia vocacional estruturado para escolhas profissionais mais claras e confiantes.
          </p>
        </div>
      </div>

      {/* ================= LADO DIREITO: Formulário ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-110 space-y-7">
          
          {/* Topo Mobile com Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-200">
              <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="w-1 h-1 bg-primary rounded-full" />
              </div>
            </div>
            <span className="font-heading text-xl font-bold text-[#1a1b22]">InRumo</span>
          </div>

          {/* Cabeçalho do Formulário */}
          <div>
            <h2 className="font-heading text-2xl sm:text-[28px] font-bold text-[#1a1b22] tracking-tight">
              Iniciar Sessão
            </h2>
            <p className="font-body text-sm text-[#504536] mt-1.5">
              Aceda à sua conta para continuar a sua jornada.
            </p>
          </div>

          {/* Cartão Branco Central com Borda Fina */}
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-5">
        <h1 className="font-heading text-headline-md text-on-surface">Entrar</h1>

        {error && <p className="text-body-sm text-error">{error}</p>}

        <div className="space-y-1">
          <label className="font-body-sm text-on-surface-variant">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="font-body-sm text-on-surface-variant">Senha</label>
            <Link to="/forgot-password" className="font-body-sm text-primary">Esqueceste-te?</Link>
          </div>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'A entrar...' : 'Entrar'}
        </button>

        <p className="text-center font-body-sm text-on-surface-variant">
          Ainda não tens conta? <Link to="/register" className="text-primary font-medium">Criar conta</Link>
        </p>
      </form>
    </div>

          {/* Link para Criar Conta */}
          <p className="text-center text-xs text-[#504536]">
            Ainda não tem conta?{' '}
            <a href="#" className="font-bold text-primary hover:underline">
              Criar conta agora
            </a>
          </p>

          {/* Divisor "Ou continuar com" */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#e8e7f1] w-full" />
            <span className="bg-[#fbf8ff] px-3 text-[11px] font-medium text-[#827564] absolute">
              Ou continuar com
            </span>
          </div>

          {/* Botões de Login Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-[#e8e7f1] text-[#1a1b22] text-xs font-semibold py-3 rounded-xl transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-[#e8e7f1] text-[#1a1b22] text-xs font-semibold py-3 rounded-xl transition-all shadow-2xs"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 0 0-1.61 1.6 1.6 1.6 0 0 0 1.61 1.61 1.6 1.6 0 0 0 1.6-1.61 1.6 1.6 0 0 0-1.6-1.6Z" />
              </svg>
              LinkedIn
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}