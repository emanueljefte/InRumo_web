import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { supabase } from '../../api/supabase';
import { SupabaseAuthRepository } from '../../data/supabase/SupabaseAuthRepository';

export default function ResetPasswordPage() {
  const cardRef = useRef<HTMLDivElement>(null);
const navigate = useNavigate();
  const authRepository = useMemo(() => new SupabaseAuthRepository(), []);

  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }, []);

  // o Supabase troca a sessão automaticamente via link do email (PASSWORD_RECOVERY event)
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (senha.length < 8) {
      setError('A senha precisa de ter pelo menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await authRepository.updatePassword(senha);
      navigate('/login', { replace: true });
    } catch {
      setError('Não foi possível redefinir a senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="font-body-sm text-on-surface-variant">A validar o link...</p>
      </div>
    );
  }
  

  

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div ref={cardRef} className="w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        <h1 className="font-heading text-2xl text-text mb-2">Nova senha</h1>
        <p className="text-textMuted text-sm mb-6">Escolhe uma nova senha pra tua conta.</p>

        <form onSubmit={handleSubmit} className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-5">
        <h1 className="font-heading text-headline-md text-on-surface">Nova senha</h1>

        {error && <p className="text-body-sm text-error">{error}</p>}

        <div className="space-y-1">
          <label className="font-body-sm text-on-surface-variant">Nova senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={8}
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
        </div>

        <div className="space-y-1">
          <label className="font-body-sm text-on-surface-variant">Confirmar senha</label>
          <input type="password" value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} required minLength={8}
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'A guardar...' : 'Redefinir senha'}
        </button>
      </form>
      </div>
    </div>
  );
}