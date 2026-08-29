import React, { useMemo, useState } from 'react';
import { associateAnonymousResult } from '../../application/test/associateAnonymousResult';
import { Link, useNavigate } from 'react-router-dom';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';

export default function RegisterPage() {
  const navigate = useNavigate();
  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { userId } = await authRepository.signUp({ nome, email, senha });
      await associateAnonymousResult(userId, testRepository); // RF11
      navigate('/candidate', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
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
        {/* Soft White/Purple Tint Overlay fiel ao design */}
        <div className="absolute inset-0 bg-linear-to-t from-[#fbf8ff]/90 via-[#fbf8ff]/40 to-[#fbf8ff]/60 z-10" />

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
            O seu futuro,<br />desenhado com clareza.
          </h1>
          <p className="font-body text-base text-[#504536] leading-relaxed max-w-md">
            Descubra o seu caminho profissional com a nossa plataforma de orientação vocacional. Baseada em dados, desenhada para o seu sucesso.
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
              Criar Conta
            </h2>
            <p className="font-body text-sm text-[#504536] mt-1.5">
              Preencha os seus dados para iniciar a jornada.
            </p>
          </div>
          
          <div className="min-h-screen bg-background flex items-center justify-center p-4">

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-5">
              <h1 className="font-heading text-headline-md text-on-surface">Criar conta</h1>

              {error && <p className="text-body-sm text-error">{error}</p>}

              <div className="space-y-1">
                <label className="font-body-sm text-on-surface-variant">Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} required
                  className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
              </div>

              <div className="space-y-1">
                <label className="font-body-sm text-on-surface-variant">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
              </div>

              <div className="space-y-1">
                <label className="font-body-sm text-on-surface-variant">Senha</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={8}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl disabled:opacity-50">
                {loading ? 'A criar conta...' : 'Criar conta'}
              </button>

              <p className="text-center font-body-sm text-on-surface-variant">
                Já tens conta? <Link to="/login" className="text-primary font-medium">Entrar</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};