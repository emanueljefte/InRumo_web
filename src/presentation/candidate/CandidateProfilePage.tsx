import { useState } from 'react';
import { Camera, Pencil, CheckCircle2, AlertCircle, Loader2, User, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseProfileRepository } from '../../data/supabase/SupabaseProfileRepository';

const profileRepository = new SupabaseProfileRepository();

export default function CandidateProfilePage() {
  const { session, profile } = useAuth();

  const [nome, setNome] = useState(profile?.nome ?? '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '')

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
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setError('Não foi possível guardar as alterações. Tenta novamente.');
    } finally {
      setLoading(false);
    }
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

  const handleCancel = () => {
    setEditing(false);
    setNome(profile?.nome ?? '');
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-body text-on-background antialiased pb-12">

      {/* Cabeçalho */}
      <div className="border-b border-outline-variant/40 pb-5 space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Configurações de Perfil
        </h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant">
          Gere os teus dados pessoais e credenciais de acesso ao InRumo.
        </p>
      </div>

      {/* Card de Identificação de Perfil */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">

        {/* Avatar com Badge de Edição */}
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

        {/* Info Rápida */}
        <div className="text-center sm:text-left space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="font-heading text-xl font-bold text-on-surface truncate">
              {nome || 'Candidato'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold">
              <ShieldCheck size={12} /> Ativo
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant truncate">
            {session?.user.email ?? 'Email não informado'}
          </p>
        </div>
      </div>

      {/* Card: Formulário de Informações Pessoais */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-8 space-y-6 shadow-xs">

        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <h3 className="font-heading text-base sm:text-lg font-bold text-on-surface">
            Informações Pessoais
          </h3>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-primary/20"
            >
              <Pencil size={13} />
              <span>Editar</span>
            </button>
          )}
        </div>

        {/* Alertas de Estado */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span>Alterações guardadas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Campo: Nome Completo */}
          <div className="space-y-2">
            <label className="block font-body text-xs font-semibold text-on-surface">
              Nome Completo
            </label>
            <div className="relative">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={!editing || loading}
                required
                placeholder="Introduz o teu nome completo"
                className={`w-full border rounded-2xl px-4 py-3 text-sm font-body text-on-surface transition-all focus:outline-none ${editing
                  ? 'border-primary/50 bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 shadow-xs'
                  : 'border-outline-variant/40 bg-surface-container-low/50 text-on-surface-variant cursor-not-allowed'
                  }`}
              />
            </div>
          </div>

          {/* Campo: Email (Somente Leitura) */}
          <div className="space-y-2">
            <label className="block font-body text-xs font-semibold text-on-surface">
              Endereço de Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/60">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={session?.user.email ?? ''}
                disabled
                className="w-full border border-outline-variant/40 rounded-2xl pl-10 pr-4 py-3 text-sm font-body bg-surface-container-low/50 text-on-surface-variant/80 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant/70 pl-1">
              O email está associado à tua conta e não pode ser alterado diretamente.
            </p>
          </div>

          {/* Ações de Edição */}
          {editing && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading || !nome.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                <span>{loading ? 'A guardar...' : 'Guardar Alterações'}</span>
              </button>
            </div>
          )}

        </form>
      </div>

    </div>
  );
}