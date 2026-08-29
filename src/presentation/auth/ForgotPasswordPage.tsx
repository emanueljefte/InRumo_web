import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';

export default function ForgotPasswordPage() {
  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }, [sent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authRepository.requestPasswordReset(email);
      setSent(true); // mesma UI de sucesso mesmo se o email não existir — evita confirmar quais emails estão registados
    } catch {
      setError('Não foi possível enviar o email. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-4 text-center">
          <h1 className="font-heading text-headline-md text-on-surface">Verifica o teu email</h1>
          <p className="font-body-sm text-on-surface-variant">
            Se existir uma conta com o email <strong>{email}</strong>, vais receber um link para redefinir a senha.
          </p>
          <Link to="/login" className="inline-block font-body-sm text-primary font-medium">Voltar ao login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div ref={cardRef} className="w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        <h1 className="font-heading text-2xl text-text mb-2">Recuperar senha</h1>
        <p className="text-textMuted text-sm mb-6">Escreve o teu email e enviamos um link pra redefinir a senha.</p>

        <form onSubmit={handleSubmit} className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-5">
        <h1 className="font-heading text-headline-md text-on-surface">Recuperar senha</h1>
        <p className="font-body-sm text-on-surface-variant">Introduz o teu email e enviamos um link para criares uma nova senha.</p>

        {error && <p className="text-body-sm text-error">{error}</p>}

        <div className="space-y-1">
          <label className="font-body-sm text-on-surface-variant">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'A enviar...' : 'Enviar link'}
        </button>

        <p className="text-center font-body-sm text-on-surface-variant">
          <Link to="/login" className="text-primary font-medium">Voltar ao login</Link>
        </p>
      </form>

        <Link to="/login" className="block text-center text-primary text-sm mt-4 hover:underline">
          Voltar
        </Link>
      </div>
    </div>
  );
}