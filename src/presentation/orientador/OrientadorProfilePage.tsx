import { useMemo, useState } from 'react';
import { Camera, Pencil, User } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseProfileRepository } from '../../data/supabase/SupabaseProfileRepository';
import { AREAS } from '../../domain/test/Area';
import { COURSE_LABELS } from '../../domain/course/courseLabels';
import type { CourseId } from '../../domain/test/TestQuestion';

const AREAS_BY_COURSE = Object.entries(AREAS).reduce<Record<CourseId, { id: string; nome: string }[]>>(
  (acc, [id, area]) => {
    if (!acc[area.cursoId]) acc[area.cursoId] = [];
    acc[area.cursoId].push({ id, nome: area.nome });
    return acc;
  },
  {} as Record<CourseId, { id: string; nome: string }[]>
);

export default function OrientadorProfilePage() {
  const { session, profile } = useAuth();
  const profileRepository = useMemo(() => new SupabaseProfileRepository(), []);

  const [nome, setNome] = useState(profile?.nome ?? '');
  const [especialidade, setEspecialidade] = useState(profile?.especialidade ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (file: File) => {
    if (!session) return;
    try {
      const url = await profileRepository.uploadAvatar(session.user.id, file);
      setAvatarUrl(url);
    } catch {
      setError('Não foi possível actualizar a fotografia.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      await profileRepository.updateProfile(session.user.id, { nome, especialidade });
      setSaved(true);
      setEditing(false);
    } catch {
      setError('Não foi possível guardar as alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-headline-lg text-on-surface tracking-tight">O teu perfil</h1>
        <p className="font-body-md text-on-surface-variant">Gere as tuas informações de orientador.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto">
          {avatarUrl ? (
            <img src={avatarUrl} alt={nome} className="w-full h-full rounded-full object-cover border-2 border-outline-variant" />
          ) : (
            <div className="w-full h-full rounded-full bg-tertiary-container/60 flex items-center justify-center text-on-primary-container font-heading text-2xl font-bold">
              {nome.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <label className="absolute bottom-0 right-0 p-2 bg-tertiary text-white rounded-full shadow-xs cursor-pointer">
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarChange(e.target.files[0])} />
          </label>
        </div>
        <h2 className="font-heading text-lg font-bold text-on-surface">{nome || 'Sem nome'}</h2>
        <p className="font-body-sm text-xs text-on-surface-variant">{especialidade}</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface">
            <User className="w-5 h-5 text-tertiary" />
            <h3 className="font-heading text-body-lg font-bold">Informações</h3>
          </div>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-tertiary hover:underline">
              <Pencil size={14} /> Editar
            </button>
          )}
        </div>

        {error && <p className="font-body-sm text-error">{error}</p>}
        {saved && <p className="font-body-sm text-primary">Alterações guardadas.</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-body-sm text-on-surface-variant">Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} disabled={!editing} required
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm disabled:bg-surface-container disabled:text-on-surface-variant" />
          </div>

          <div className="space-y-1">
            <label className="font-body-sm text-on-surface-variant">Especialidade</label>
            <select value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} disabled={!editing} required
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm disabled:bg-surface-container disabled:text-on-surface-variant">
              <option value="" disabled>Seleciona uma especialidade</option>
              {(Object.entries(AREAS_BY_COURSE) as [CourseId, { id: string; nome: string }[]][]).map(([cursoId, areas]) => (
                <optgroup key={cursoId} label={COURSE_LABELS[cursoId]}>
                  {areas.map((area) => <option key={area.id} value={area.nome}>{area.nome}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-body-sm text-on-surface-variant">Email</label>
            <input value={session?.user.email ?? ''} disabled
              className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm bg-surface-container text-on-surface-variant" />
          </div>

          {editing && (
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => { setEditing(false); setNome(profile?.nome ?? ''); setEspecialidade(profile?.especialidade ?? ''); }}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface-variant">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-tertiary text-white text-xs font-semibold disabled:opacity-50">
                {loading ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}