import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  ExternalLink,
  ShieldAlert,
  Inbox,
  X,
  AlertTriangle,
  Clock,
  AlertCircle,
  User,
  GraduationCap
} from 'lucide-react';
import { SupabaseEnrollmentReviewRepository } from '../../data/supabase/SupabaseEnrollmentReviewRepository';
import { supabase } from '../../api/supabase';
import type { PendingEnrollment } from '../../domain/admin/EnrollmentReviewRepository';
import { COURSE_LABELS } from '../../domain/course/courseLabels';

export default function EnrollmentReviewPage() {
  const repository = useMemo(() => new SupabaseEnrollmentReviewRepository(), []);

  // Estados de dados e carregamento
  const [pending, setPending] = useState<PendingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Ação Individual
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modal de Visualização de Documento
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null);

  // Modal de Rejeição com Motivo
  const [rejectingItem, setRejectingItem] = useState<PendingEnrollment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Carregamento Inicial com Proteção de Desmontagem
  useEffect(() => {
    let isMounted = true;

    async function loadPending() {
      try {
        const data = await repository.getPendingEnrollments();
        
        if (isMounted) {
          setPending(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar comprovativos pendentes.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPending();

    return () => {
      isMounted = false;
    };
  }, [repository]);

  // Visualizar Documento (Gera Signed URL + Modal)
  const handleView = async (item: PendingEnrollment) => {
    try {
      setLoadingPreview(item.documentId);
      const { data, error: storageError } = await supabase.storage
        .from('enrollment-documents')
        .createSignedUrl(item.filePath, 60 * 15); // URL válida por 15 min

      if (storageError || !data?.signedUrl) {
        throw new Error('Não foi possível gerar o link do documento.');
      }

      setPreviewTitle(`Comprovativo - ${item.userNome}`);
      setPreviewUrl(data.signedUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao abrir o ficheiro.');
    } finally {
      setLoadingPreview(null);
    }
  };

  // Aprovar Comprovativo
  const handleApprove = async (item: PendingEnrollment) => {
    if (!item.cursoId) {
      alert('Este utilizador não seleccionou um curso no registo. Não é possível aprovar.');
      return;
    }
    setProcessingId(item.documentId);
    try {
      await repository.approveEnrollment(item.documentId, item.userId, item.numeroProcesso, item.cursoId);
      setPending((prev) => prev.filter((p) => p.documentId !== item.documentId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao aprovar comprovativo.');
    } finally {
      setProcessingId(null);
    }
  };

  // Confirmar Rejeição com Motivo
  const handleConfirmReject = async () => {
    if (!rejectingItem) return;

    setProcessingId(rejectingItem.documentId);
    try {
      // Se o teu repositório suportar motivo, passa rejectionReason
      await repository.rejectEnrollment(rejectingItem.documentId, rejectingItem.userId);
      setPending((prev) => prev.filter((p) => p.documentId !== rejectingItem.documentId));
      setRejectingItem(null);
      setRejectionReason('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao rejeitar comprovativo.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Validação de Comprovativos
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Aprove ou rejeite os recibos de pagamento de inscrição enviados pelos candidatos.
          </p>
        </div>

        {!loading && (
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs px-3.5 py-2 rounded-full self-start sm:self-auto border border-primary/20 shrink-0">
            <Clock className="w-4 h-4" />
            <span>{pending.length} Pendente{pending.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Alerta de Erro Geral */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 text-xs font-semibold text-error">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Estado de Carregamento (Skeleton) */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-5 w-48 bg-surface-container rounded-md" />
                <div className="h-4 w-24 bg-surface-container rounded-md" />
              </div>
              <div className="h-4 w-1/3 bg-surface-container rounded-md" />
              <div className="flex justify-end gap-2 pt-2">
                <div className="h-10 w-28 bg-surface-container rounded-xl" />
                <div className="h-10 w-36 bg-surface-container rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : pending.length === 0 ? (

        /* Estado Vazio */
        <div className="text-center py-16 px-4 bg-surface-container-lowest border border-outline-variant/60 rounded-3xl space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading text-base font-bold text-on-surface">Tudo em dia!</h3>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Não existem comprovativos de inscrição pendentes de validação no momento.
            </p>
          </div>
        </div>
      ) : (

        /* Lista de Comprovativos Pendentes */
        <div className="grid grid-cols-1 gap-4">
          {pending.map((item) => {
            const isProcessing = processingId === item.documentId;
            const isLoadingThisPreview = loadingPreview === item.documentId;

            return (
              <div
                key={item.documentId}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 space-y-4 transition-all hover:border-outline-variant shadow-2xs overflow-hidden"
              >
                {/* Banner de Aviso de Processo Duplicado */}
                {item.isDuplicate && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-error/10 border border-error/20 text-xs font-medium text-error">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Atenção: Este número de processo já foi utilizado por outra conta verificada.</span>
                  </div>
                )}

                {/* Informações Principais do Candidato */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary shrink-0" />
                      <p className="font-body text-base font-bold text-on-surface truncate">
                        {item.userNome}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                      <span>ID: <code className="bg-surface-container-low px-1.5 py-0.5 rounded text-[11px] font-mono">{item.userId.substring(0, 8)}...</code></span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1 font-medium text-on-surface">
                        <GraduationCap className="w-3.5 h-3.5 text-on-surface-variant" />
                        <span>{item.cursoId ? COURSE_LABELS[item.cursoId] : 'Curso não seleccionado'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botão para Ver Comprovativo */}
                  <button
                    type="button"
                    onClick={() => handleView(item)}
                    disabled={isLoadingThisPreview || isProcessing}
                    className="inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-primary font-semibold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-outline-variant/30 self-start sm:self-auto shrink-0 disabled:opacity-50"
                  >
                    {isLoadingThisPreview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>Ver Comprovativo</span>
                  </button>
                </div>

                {/* Divisória Discreta */}
                <div className="border-t border-outline-variant/30" />

                {/* Ações de Decisão */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRejectingItem(item)}
                    disabled={isProcessing}
                    className="inline-flex items-center justify-center gap-1.5 bg-error/10 hover:bg-error/20 text-error font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeitar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(item)}
                    disabled={isProcessing}
                    className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Aprovar Inscrição</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL PREVIEW DO COMPROVATIVO ================= */}
      {previewUrl && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">

            {/* Header do Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/40 bg-surface-container-low">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading font-bold text-sm sm:text-base text-on-surface truncate">
                  {previewTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-on-surface-variant hover:text-primary rounded-xl hover:bg-surface-container transition-colors"
                  title="Abrir numa nova aba"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Frame do Documento */}
            <div className="flex-1 bg-surface-container-high/40 relative">
              <iframe
                src={previewUrl}
                title="Comprovativo em PDF"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE REJEIÇÃO ================= */}
      {rejectingItem && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-xl animate-scaleIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-error/10 text-error shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-base text-on-surface">Rejeitar Comprovativo</h3>
                <p className="font-body text-xs text-on-surface-variant truncate mt-0.5">
                  Candidato: <strong className="text-on-surface">{rejectingItem.userNome}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface">
                Motivo da rejeição (opcional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Documento ilegível, talão incompleto ou valor incorreto."
                rows={3}
                className="w-full border border-outline-variant/60 rounded-2xl p-3 text-xs sm:text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20 transition-all placeholder:text-on-surface-variant/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRejectingItem(null);
                  setRejectionReason('');
                }}
                disabled={processingId === rejectingItem.documentId}
                className="px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={processingId === rejectingItem.documentId}
                className="inline-flex items-center gap-2 bg-error text-on-error font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-error/90 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {processingId === rejectingItem.documentId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>A rejeitar...</span>
                  </>
                ) : (
                  <span>Confirmar Rejeição</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}