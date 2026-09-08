import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, Compass, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';

// Regex de validação
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export default function LoginPage() {
  const navigate = useNavigate();
  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  
  // Estados de erro e feedback
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);

  // Validação em tempo real ou pré-submissão
  const validateForm = (): boolean => {
    const errors: { email?: string; senha?: string } = {};

    if (!email.trim()) {
      errors.email = 'O endereço de e-mail é obrigatório.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Introduz um endereço de e-mail válido (ex: candidato@instic.ao).';
    }

    if (!senha) {
      errors.senha = 'A palavra-passe é obrigatória.';
    } else if (senha.length < PASSWORD_MIN_LENGTH) {
      errors.senha = `A palavra-passe deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      await authRepository.signIn({ email: email.trim(), senha });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';

      if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid_grant')) {
        setError('E-mail ou palavra-passe incorretos. Por favor, verifica os teus dados.');
      } else if (errorMessage.includes('email not confirmed')) {
        setError('O teu e-mail ainda não foi confirmado. Verifica a tua caixa de entrada.');
      } else if (errorMessage.includes('too many requests') || errorMessage.includes('rate limit')) {
        setError('Muitas tentativas falhadas. Aguarda alguns minutos antes de tentar novamente.');
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError('Erro de ligação à rede. Verifica a tua conexão com a internet.');
      } else {
        setError('Ocorreu um erro ao iniciar sessão. Tenta novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-surface-container-lowest antialiased text-on-surface">
      
      {/* ================= LADO ESQUERDO: Painel Institucional ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a1b22] overflow-hidden flex-col justify-between p-12 xl:p-16 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-25 mix-blend-luminosity scale-105 transition-transform duration-10000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1b22] via-[#1a1b22]/70 to-transparent z-10" />

        {/* Logo / Badge Superior */}
        <div className="relative z-20 flex items-center gap-3">
          <div className="bg-primary/10 border border-primary/30 p-3 rounded-2xl backdrop-blur-md flex items-center justify-center text-primary shadow-inner">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white">InRumo</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 space-y-6 max-w-lg mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-gray-200 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Plataforma Oficial INSTIC</span>
          </div>

          <h1 className="font-heading text-4xl xl:text-[44px] font-bold tracking-tight leading-[1.15] text-white">
            Descobre o teu caminho académico com clareza.
          </h1>

          <p className="font-body text-sm text-gray-300 leading-relaxed">
            Acede ao teu diagnóstico de aptidões vocacionais, analisa planos de estudos interativos e fala diretamente com o Orientador Académico.
          </p>
        </div>

        <div className="relative z-20 text-xs text-gray-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>&copy; {new Date().getFullYear()} InRumo • INSTIC</span>
          <span>Orientação & Tecnologia</span>
        </div>
      </div>

      {/* ================= LADO DIREITO: Formulário de Autenticação ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Ação de Voltar para Home & Logo Mobile */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors py-2 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Voltar ao Início</span>
            </Link>

            {/* Topo Mobile (Logo) */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 text-primary">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl font-bold text-on-surface">InRumo</span>
            </div>
          </div>

          {/* Cabeçalho */}
          <div className="space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Iniciar Sessão
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant">
              Introduz os teus dados para acederes à tua conta de candidato ou estudante.
            </p>
          </div>

          {/* Banner de Erro Geral */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 text-xs font-semibold text-error animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            
            {/* Campo E-mail */}
            <div className="space-y-1.5">
              <label className="block font-body text-xs font-semibold text-on-surface">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="exemplo@instic.ao"
                disabled={loading}
                className={`w-full border rounded-2xl px-4 py-3.5 font-body text-sm text-on-surface bg-surface-container-lowest focus:outline-none transition-all placeholder:text-on-surface-variant/50 ${
                  fieldErrors.email
                    ? 'border-error focus:ring-2 focus:ring-error/20'
                    : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] font-medium text-error pl-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Campo Palavra-passe */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-body text-xs font-semibold text-on-surface">
                  Palavra-passe
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Esqueceu a palavra-passe?
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    if (fieldErrors.senha) setFieldErrors((prev) => ({ ...prev, senha: undefined }));
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full border rounded-2xl pl-4 pr-11 py-3.5 font-body text-sm text-on-surface bg-surface-container-lowest focus:outline-none transition-all placeholder:text-on-surface-variant/50 ${
                    fieldErrors.senha
                      ? 'border-error focus:ring-2 focus:ring-error/20'
                      : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface cursor-pointer disabled:opacity-50"
                  disabled={loading}
                  tabIndex={-1}
                  aria-label={showSenha ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                >
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.senha && (
                <p className="text-[11px] font-medium text-error pl-1">{fieldErrors.senha}</p>
              )}
            </div>

            {/* Botão Submeter com Feedback de Loading */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 shadow-xs hover:shadow-primary/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A autenticar...</span>
                </>
              ) : (
                <>
                  <span>Entrar na Conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divisor Visual Corrigido */}
          <div className="relative flex items-center my-6">
            <div className="grow border-t border-outline-variant/40" />
            <span className="shrink-0 px-3 text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Ou continuar com
            </span>
            <div className="grow border-t border-outline-variant/40" />
          </div>

          {/* Autenticação Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs font-semibold py-3 rounded-2xl transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs font-semibold py-3 rounded-2xl transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 0 0-1.61 1.6 1.6 1.6 0 0 0 1.61 1.61 1.6 1.6 0 0 0 1.6-1.61 1.6 1.6 0 0 0-1.6-1.6Z" />
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>

          <p className="text-center text-xs text-on-surface-variant pt-2">
            Ainda não tens conta?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Criar conta agora
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}