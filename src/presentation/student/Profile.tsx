// presentation/student/StudentProfilePage.tsx
import { useMemo, useState, useId } from 'react';
import { Camera, Pencil, GraduationCap, User, AlertCircle, CheckCircle2, Loader2, Mail, Info } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseProfileRepository } from '../../data/supabase/SupabaseProfileRepository';
import { COURSE_LABELS } from '../../domain/course/courseLabels';

export default function StudentProfilePage() {
  const { session, profile } = useAuth();
  const profileRepository = useMemo(() => new SupabaseProfileRepository(), []);

  const [nome, setNome] = useState(profile?.nome ?? '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '')

  const nameInputId = useId();
  const emailInputId = useId();

  console.log(profile);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !nome.trim()) return;

    setError(null);
    setSaved(false);
    setLoading(true);

    try {
      await profileRepository.updateProfile(session.user.id, { nome: nome.trim() });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setError('Não foi possível guardar as alterações. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setNome(profile?.nome ?? '');
    setError(null);
  };
  const handleAvatarChange = async (file: File) => {
    if (!session) return;
    try {
      const url = await profileRepository.uploadAvatar(session.user.id, file);
      setAvatarUrl(url);
    } catch {
      setError('Não foi possível actualizar a fotografia.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-body text-on-background antialiased pb-12">

      {/* Cabeçalho */}
      <header className="border-b border-outline-variant/40 pb-5 space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Configurações de Perfil
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Gere as tuas informações pessoais e académicas.
        </p>
      </header>

      {/* Card de Identificação de Perfil & Avatar */}
      <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">

        {/* Avatar */}
        <div className="relative group shrink-0">

          {avatarUrl ? (
            <img src={avatarUrl} alt={nome} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-heading text-3xl font-bold uppercase shadow-inner">
              {nome.charAt(0) || <User className="w-10 h-10" />}
            </div>
          )}

          <button
            type="button"
            title="Alterar fotografia"
            className="absolute bottom-0 right-0 p-2.5 bg-surface-container-high text-on-surface-variant border border-outline-variant/60 rounded-full shadow-xs opacity-80"
          >
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarChange(e.target.files[0])} />
          </button>
        </div>

        {/* Informação Rápida */}
        <div className="text-center sm:text-left space-y-1 flex-1 min-w-0">
          <h2 className="font-heading text-xl font-bold text-on-surface truncate">
            {nome.trim() || 'Sem nome'}
          </h2>
          {profile?.cursoId && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <GraduationCap size={14} className="shrink-0" />
              <span className="truncate">Estudante de {COURSE_LABELS[profile.cursoId]}</span>
            </div>
          )}
        </div>
      </section>

      {/* Card: Informações Pessoais */}
      <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-8 space-y-6 shadow-xs">

        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-2 text-on-surface">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-base sm:text-lg font-bold">Informações Pessoais</h3>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            >
              <Pencil size={13} />
              <span>Editar</span>
            </button>
          )}
        </div>

        {/* Alertas Acessíveis */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-semibold animate-in fade-in"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold animate-in fade-in"
          >
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>Alterações guardadas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nome */}
          <div className="space-y-2">
            <label
              htmlFor={nameInputId}
              className="block font-body text-xs font-semibold text-on-surface"
            >
              Nome
            </label>
            <input
              id={nameInputId}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={!editing || loading}
              required
              placeholder="Introduz o teu nome"
              className={`w-full border rounded-2xl px-4 py-3 text-sm font-body text-on-surface transition-all focus:outline-none ${editing
                  ? 'border-primary/50 bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 shadow-xs'
                  : 'border-outline-variant/40 bg-surface-container-low/50 text-on-surface-variant cursor-not-allowed'
                }`}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor={emailInputId}
              className="block font-body text-xs font-semibold text-on-surface"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/60">
                <Mail size={16} />
              </div>
              <input
                id={emailInputId}
                type="email"
                value={session?.user.email ?? ''}
                disabled
                className="w-full border border-outline-variant/40 rounded-2xl pl-10 pr-4 py-3 text-sm font-body bg-surface-container-low/50 text-on-surface-variant/80 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          {editing && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30 animate-in fade-in">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading || !nome.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                <span>{loading ? 'A guardar...' : 'Guardar'}</span>
              </button>
            </div>
          )}

        </form>
      </section>

      {/* Card: Informação Académica (Somente Leitura) */}
      <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 text-on-surface border-b border-outline-variant/30 pb-4">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-base sm:text-lg font-bold">Informação Académica</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface">Curso</label>
            <input
              readOnly
              value={profile?.cursoId ? COURSE_LABELS[profile.cursoId] : '—'}
              className="w-full bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant px-4 py-3 rounded-2xl border border-outline-variant/40 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface">Número de Processo</label>
            <input
              readOnly
              value={profile?.numeroProcesso ?? '—'}
              className="w-full bg-surface-container-low/50 font-mono text-xs font-bold text-primary px-4 py-3 rounded-2xl border border-outline-variant/40 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/30 text-on-surface-variant text-xs">
          <Info size={16} className="shrink-0 text-primary mt-0.5" />
          <p className="leading-relaxed">
            Estes dados foram validados pela Administração Académica no momento da matrícula. Se algo estiver incorreto, contacta a Administração Académica.
          </p>
        </div>
      </section>

    </div>
  );
}