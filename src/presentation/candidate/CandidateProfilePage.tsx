import { useMemo, useState } from 'react';
import { Camera, Pencil } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseProfileRepository } from '../../data/supabase/SupabaseProfileRepository';

export default function CandidateProfilePage() {
  const { session, profile } = useAuth();
  const profileRepository = useMemo(() => new SupabaseProfileRepository(), []);

  const [nome, setNome] = useState(profile?.nome ?? '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      await profileRepository.updateProfile(session.user.id, { nome });
      setSaved(true);
      setEditing(false);
    } catch {
      setError('Não foi possível guardar as alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 font-body text-on-background antialiased">
      <div className="space-y-1">
        <h1 className="font-heading text-headline-lg text-on-surface">Configurações de Perfil</h1>
        <p className="font-body-sm text-on-surface-variant">Gerencia as tuas informações pessoais.</p>
      </div>

      {/* Card: Avatar */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-full h-full rounded-full bg-primary-container/60 flex items-center justify-center text-on-primary-container font-heading text-2xl font-bold">
            {nome.charAt(0).toUpperCase() || '?'}
          </div>
          <button
            type="button"
            title="Alterar fotografia — em breve"
            disabled
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-xs opacity-50 cursor-not-allowed"
          >
            <Camera size={14} />
          </button>
        </div>
        <h2 className="font-heading text-lg font-bold text-on-surface">{nome || 'Sem nome'}</h2>
      </div>

      {/* Card: Informações Pessoais */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-body-lg font-bold text-on-surface">Informações Pessoais</h3>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
              <Pencil size={14} /> Editar
            </button>
          )}
        </div>

        {error && <p className="font-body-sm text-error">{error}</p>}
        {saved && <p className="font-body-sm text-primary">Alterações guardadas.</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-body-sm text-on-surface-variant">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={!editing}
              required
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm disabled:bg-surface-container disabled:text-on-surface-variant"
            />
          </div>

          <div className="space-y-1">
            <label className="font-body-sm text-on-surface-variant">Email</label>
            <input value={session?.user.email ?? ''} disabled
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm bg-surface-container text-on-surface-variant" />
          </div>

          {editing && (
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => { setEditing(false); setNome(profile?.nome ?? ''); }}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface-variant">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold disabled:opacity-50">
                {loading ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}