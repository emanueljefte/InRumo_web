import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { AlertCircle, ArrowLeft, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { associateAnonymousResult } from '../../application/test/associateAnonymousResult';

// Expressões Regulares (Regex) para validação no Frontend
const REGEX = {
  NOME_COMPLETO: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\s-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Mínimo 8 caracteres: pelo menos uma letra maiúscula, uma minúscula e um número
  SENHA_FORTE: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
};

// Mapeamento de erros do Supabase / Backend para Português amigável
const translateErrorMessage = (errorMsg: string): string => {
  const msg = errorMsg.toLowerCase();
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Este e-mail já está registado. Tenta iniciar sessão.';
  }
  if (msg.includes('network error') || msg.includes('failed to fetch')) {
    return 'Erro de ligação ao servidor. Verifica a tua rede.';
  }
  return errorMsg || 'Ocorreu um erro inesperado ao criar a conta.';
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);

  // Estados dos Campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estados de Erro Isolados (Apenas para submissão)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Determina a classe de borda baseada APENAS se existe erro registado para o campo
  // Corrigido: Não executa validação aqui, apenas lê o estado de erro existente.
  const getInputBorderClass = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      return 'border-red-500 focus:ring-red-100';
    }
    return 'border-[#e8e7f1] focus:border-primary focus:ring-primary/10';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const errors: Record<string, string> = {};

    // 1. Validação Frontend estrita via Regex antes da submissão
    const cleanNome = nome.trim();
    const cleanEmail = email.trim();

    if (!cleanNome) {
      errors.nome = 'O nome completo é obrigatório.';
    } else if (!REGEX.NOME_COMPLETO.test(cleanNome)) {
      errors.nome = 'Introduz o teu nome e sobrenome válidos.';
    }

    if (!cleanEmail) {
      errors.email = 'O e-mail é obrigatório.';
    } else if (!REGEX.EMAIL.test(cleanEmail)) {
      errors.email = 'Introduz um endereço de e-mail válido (ex: aluno@instic.ao).';
    }

    if (!senha) {
      errors.senha = 'A palavra-passe é obrigatória.';
    } else if (!REGEX.SENHA_FORTE.test(senha)) {
      errors.senha = 'A senha deve ter 8+ caracteres, com letra maiúscula, minúscula e número.';
    }

    // Atualiza erros de campo. Se houver erros, interrompe a submissão.
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Limpa erros de campo se a validação passar
    setFieldErrors({});
    setLoading(true);

    try {
      // 2. Tenta o registo com dados sanitizados
      const { userId } = await authRepository.signUp({ 
        nome: cleanNome, 
        email: cleanEmail.toLowerCase(), // Garante e-mail em minúsculas
        senha, 
        intent: 'candidate' 
      });

      await associateAnonymousResult(userId, testRepository); // RF11
      navigate('/candidate', { replace: true });
    } catch (err) {
      // 3. Tratamento e tradução de erros vindos do Supabase
      const rawMessage = err instanceof Error ? err.message : 'Erro ao criar conta.';
      setGeneralError(translateErrorMessage(rawMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fbf8ff] antialiased">
      {/* ================= LADO ESQUERDO: Painel Institucional ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 filter brightness-[0.98] contrast-[0.95]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8ff]/90 via-[#fbf8ff]/40 to-[#fbf8ff]/60 z-10" />

        <div className="relative z-20">
          <div className="bg-white/90 backdrop-blur-md w-16 h-16 rounded-xl p-3 shadow-sm border border-white/60 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-primary">
              <div className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center relative">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
              <span className="text-[8px] font-bold tracking-tight text-[#1a1b22] mt-0.5">InRumo</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 max-w-lg mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Candidato</span>
          </div>
          <h1 className="font-heading text-4xl xl:text-[42px] leading-[1.15] font-bold text-[#1a1b22] tracking-tight mb-4">
            O seu futuro,<br />desenhado com clareza.
          </h1>
          <p className="font-body text-base text-[#504536] leading-relaxed max-w-md">
            Descubra o seu caminho profissional com a nossa plataforma de orientação vocacional inteligente. Baseada em dados, desenhada para o seu sucesso no INSTIC.
          </p>
        </div>
      </div>

      {/* ================= LADO DIREITO: Formulário de Cadastro ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 my-auto">
        <div className="w-full max-w-md space-y-6">
          
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#504536] hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Alterar tipo de perfil</span>
          </Link>

          <div>
            <h2 className="font-heading text-2xl sm:text-[28px] font-bold text-[#1a1b22] tracking-tight">
              Criar Conta de Candidato
            </h2>
            <p className="font-body text-sm text-[#504536] mt-1.5">
              Preencha os seus dados para iniciar o teste vocacional inteligente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {generalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs font-medium text-red-600 flex items-center gap-2 animate-in fade-in-50 duration-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                    setNome(e.target.value);
                    if (fieldErrors.nome) setFieldErrors(prev => ({ ...prev, nome: '' }));
                }}
                placeholder="Ex: Emanuel João"
                required
                className={`w-full bg-white border ${getInputBorderClass('nome')} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {fieldErrors.nome && (
                <p className="text-[11px] font-medium text-red-500 animate-in slide-in-from-top-1 duration-200">
                  {fieldErrors.nome}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="seu.email@exemplo.com"
                required
                className={`w-full bg-white border ${getInputBorderClass('email')} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] font-medium text-red-500 animate-in slide-in-from-top-1 duration-200">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Palavra-passe */}
            <div className="space-y-1.5">
              <label className="font-body-sm text-xs font-semibold text-[#1a1b22]">
                Palavra-passe
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => {
                    setSenha(e.target.value);
                    if (fieldErrors.senha) setFieldErrors(prev => ({ ...prev, senha: '' }));
                }}
                placeholder="Ex: Exemplo123"
                required
                minLength={8}
                className={`w-full bg-white border ${getInputBorderClass('senha')} rounded-xl px-4 py-3 font-body-sm text-sm text-[#1a1b22] focus:outline-none focus:ring-2 transition-all duration-200`}
              />
              {fieldErrors.senha && (
                <p className="text-[11px] font-medium text-red-500 animate-in slide-in-from-top-1 duration-200 leading-relaxed">
                  {fieldErrors.senha}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold text-sm py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-primary/20 disabled:opacity-50 cursor-pointer active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A criar conta...</span>
                  </>
              ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Criar Conta de Candidato</span>
                  </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#e8e7f1] w-full" />
            <span className="bg-[#fbf8ff] px-3 text-[11px] font-medium text-[#827564] absolute">
              Ou registar com
            </span>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-[#e8e7f1] text-[#1a1b22] text-xs font-semibold py-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-[#e8e7f1] text-[#1a1b22] text-xs font-semibold py-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 0 0-1.61 1.6 1.6 1.6 0 0 0 1.61 1.61 1.6 1.6 0 0 0 1.6-1.61 1.6 1.6 0 0 0-1.6-1.6Z" />
              </svg>
              LinkedIn
            </button>
          </div>

          <p className="text-center text-xs text-[#504536] pt-2">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Iniciar sessão
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};