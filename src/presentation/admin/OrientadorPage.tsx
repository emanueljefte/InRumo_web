import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, UserCheck, Loader2, X, Users, Mail, GraduationCap, AlertCircle } from 'lucide-react';
import { SupabaseOrientadorManagementRepository } from '../../data/supabase/SupabaseOrientadorManagementRepository';
import type { OrientadorSummary } from '../../domain/admin/OrientadorManagement';
import { AREAS } from '../../domain/test/Area';
import type { CourseId } from '../../domain/test/TestQuestion';
import { COURSE_LABELS } from '../../domain/course/courseLabels';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AREAS_BY_COURSE = Object.entries(AREAS).reduce<Record<CourseId, { id: string; nome: string }[]>>(
  (acc, [id, area]) => {
    if (!acc[area.cursoId]) acc[area.cursoId] = [];
    acc[area.cursoId].push({ id, nome: area.nome });
    return acc;
  },
  {} as Record<CourseId, { id: string; nome: string }[]>
);

export default function OrientadoresPage() {
  const repository = useMemo(() => new SupabaseOrientadorManagementRepository(), []);

  // Estados de dados e carregamento
  const [orientadores, setOrientadores] = useState<OrientadorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingConfirmId, setDeletingConfirmId] = useState<string | null>(null);

  // Estados do Modal / Formulário
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setNome('');
    setEmail('');
    setEspecialidade('');
    setError(null);
    setShowForm(false);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await repository.listOrientadores();
        if (isMounted) {
          setOrientadores(data);
        }
      } catch {
        if (isMounted) {
          setError('Erro ao carregar a lista de orientadores.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false; // Evita atualizar estado se o componente for desmontado
    };
  }, [repository]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setCreating(true);
    try {
      // 1. Cria o orientador no repositório
      const result = await repository.createOrientador({
        nome: nome.trim(),
        email: email.trim(),
        especialidade: especialidade.trim()
      });

      if (result.tempPassword) alert(`Senha temporária (só visível agora, para testes): ${result.tempPassword}`)

      console.log(result);

      // 2. Recarrega a lista do repositório
      const updatedList = await repository.listOrientadores();
      setOrientadores(updatedList);

      // 3. Limpa e fecha o formulário
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registar orientador.');
    } finally {
      setCreating(false);
    }
  };

  const handleRemove = async (id: string) => {
    setDeletingId(id);
    try {
      await repository.removeOrientador(id);
      setOrientadores((prev) => prev.filter((o) => o.id !== id));
      setDeletingConfirmId(null);
    } catch {
      alert('Erro ao remover o orientador. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/40">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Gestão de Orientadores
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant">
            Gerencie o corpo docente e os especialistas responsáveis pela orientação académica no InRumo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all shadow-xs hover:shadow-primary/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Orientador</span>
        </button>
      </div>

      {/* Estado de Carregamento (Skeleton) */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-surface-container rounded-md" />
                  <div className="h-3 w-48 bg-surface-container rounded-md" />
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-surface-container" />
            </div>
          ))}
        </div>
      ) : orientadores.length === 0 ? (

        /* Estado Vazio (Empty State) */
        <div className="text-center py-16 px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading text-base font-bold text-on-surface">Nenhum orientador registado</h3>
            <p className="font-body text-xs text-on-surface-variant">
              Adicione o primeiro especialista para começar a responder aos candidatos e gerir orientações vocacionais.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registar Orientador</span>
          </button>
        </div>
      ) : (

        /* Lista de Orientadores */
        <div className="grid grid-cols-1 gap-3">
          {orientadores.map((o) => {
            const initial = o.nome.charAt(0).toUpperCase();
            const isDeletingThis = deletingId === o.id;
            const isConfirmingThis = deletingConfirmId === o.id;

            return (
              <div
                key={o.id}
                className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 transition-all hover:border-outline-variant shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                    {initial}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-body text-sm font-bold text-on-surface truncate">{o.nome}</p>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        {o.email}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface px-2 py-0.5 rounded-md font-medium text-[11px]">
                        <GraduationCap className="w-3 h-3 text-primary shrink-0" />
                        {o.especialidade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações / Confirmação de Eliminação */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {isConfirmingThis ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => handleRemove(o.id)}
                        disabled={isDeletingThis}
                        className="bg-error text-on-error font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-error/90 transition-all cursor-pointer flex items-center gap-1"
                      >
                        {isDeletingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirmar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingConfirmId(null)}
                        disabled={isDeletingThis}
                        className="bg-surface-container text-on-surface font-semibold text-xs px-2.5 py-1.5 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeletingConfirmId(o.id)}
                      className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all cursor-pointer"
                      aria-label={`Remover ${o.nome}`}
                      title="Remover orientador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL NOVO ORIENTADOR ================= */}
      {showForm && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant/60 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-xl animate-scaleIn relative">

            {/* Header do Modal */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface">Registar Novo Orientador</h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alerta de Erro */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-error/10 border border-error/20 text-xs font-semibold text-error">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleCreate} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Prof. Doutor Carlos Silva"
                  required
                  disabled={creating}
                  className="w-full border border-outline-variant/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">E-mail Institucional</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos.silva@instic.ao"
                  required
                  disabled={creating}
                  className="w-full border border-outline-variant/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">Especialidade / Área de Atuação</label>
                <select
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  required
                  disabled={creating}
                  className="w-full border border-outline-variant/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="" disabled>Seleciona uma especialidade</option>
                  {(Object.entries(AREAS_BY_COURSE) as [CourseId, { id: string; nome: string }[]][]).map(([cursoId, areas]) => (
                    <optgroup key={cursoId} label={COURSE_LABELS[cursoId]}>
                      {areas.map((area) => (
                        <option key={area.id} value={area.nome}>{area.nome}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={creating}
                  className="px-5 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>A registar...</span>
                    </>
                  ) : (
                    <span>Registar</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}