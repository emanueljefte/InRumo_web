import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  FileCheck,
  Upload,
  AlertCircle,
  Loader2,
  FileText,
  X,
  ArrowRight,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { completeMatriculadoVerification } from '../../application/auth/registerMatriculado';
import { SupabaseAdmissionVerificationRepository } from '../../data/supabase/SupabaseAdmissionVerificationRepository';
import { SupabaseEnrollmentDocumentRepository } from '../../data/supabase/SupabaseEnrollmentDocumentRepository';
import type { CourseId } from '../../domain/test/TestQuestion';

// Regex para validar número de processo (ex: números com 4 a 12 dígitos)
const PROCESSO_REGEX = /^\d{4,12}$/;

const COURSES: { id: CourseId; name: string }[] = [
  { id: 'eng-informatica', name: 'Engenharia Informática' },
  { id: 'eng-telecom', name: 'Engenharia de Telecomunicações' },
  { id: 'informatica-gestao', name: 'Informática de Gestão' },
];

export default function CompleteEnrollmentPage() {
  const navigate = useNavigate();
  const { session, profile, signOut, refreshProfile } = useAuth();

  const admissionRepo = useMemo(() => new SupabaseAdmissionVerificationRepository(), []);
  const documentRepo = useMemo(() => new SupabaseEnrollmentDocumentRepository(), []);

  // Estados do Formulário
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [cursoId, setCursoId] = useState<CourseId>('eng-informatica');
  const [documento, setDocumento] = useState<File | null>(null);

  // Estados de Validação e UX
  const [needsDocument, setNeedsDocument] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processoError, setProcessoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validar número de processo em tempo de digitação
  const handleProcessoChange = (val: string) => {
    const cleanVal = val.trim();
    setNumeroProcesso(cleanVal);

    if (cleanVal && !PROCESSO_REGEX.test(cleanVal)) {
      setProcessoError('O número de processo deve conter apenas números (mínimo 4 dígitos).');
    } else {
      setProcessoError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session || !profile) {
      setError('Sessão expirada. Por favor, volte a iniciar sessão.');
      return;
    }

    // Validação estrita por Regex
    if (!PROCESSO_REGEX.test(numeroProcesso.trim())) {
      setProcessoError('Insira um número de processo válido para continuar.');
      return;
    }

    if (needsDocument && !documento) {
      setError('É obrigatório anexar um comprovativo de matrícula para verificação manual.');
      return;
    }

    setLoading(true);

    try {
      
      const result = await completeMatriculadoVerification(
        session.user.id,
        { nome: profile.nome, numeroProcesso, cursoId: cursoId || undefined, documento: documento ?? undefined },
        admissionRepo, documentRepo,
      );

      if (result.status === 'verified') {
        await refreshProfile()
        navigate('/student', { replace: true });
      } else if (result.status === 'pending') {
        await refreshProfile()
        navigate('/pending-verification', { replace: true });
      } else {
        // Estágio onde o sistema exige o envio do documento
        setNeedsDocument(true);
        setError('Não te encontrámos na lista automática de admitidos. Por favor, anexa o teu comprovativo de matrícula.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível validar a matrícula. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest/60 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Decorativo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-6 shadow-xl relative z-10 animate-scaleIn">

        {/* Header com Ícone */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Completar Matrícula
            </h1>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
              A tua conta foi criada! Confirma os teus dados académicos para teres acesso completo ao <strong className="text-on-surface">InRumo</strong>.
            </p>
          </div>
        </div>

        {/* Alerta de Erro Geral */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-error/10 border border-error/20 text-xs font-semibold text-error animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Campo: Número de Processo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface">
              Número de Processo
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={numeroProcesso}
                onChange={(e) => handleProcessoChange(e.target.value)}
                placeholder="Ex: 20260412"
                required
                disabled={loading}
                className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface bg-surface-container-lowest focus:outline-none transition-all placeholder:text-on-surface-variant/50 ${processoError
                    ? 'border-error focus:ring-2 focus:ring-error/20'
                    : 'border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
              />
              <FileCheck className="w-4 h-4 text-on-surface-variant/40 absolute right-3.5 top-3.5" />
            </div>
            {processoError && (
              <p className="text-[11px] font-medium text-error flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{processoError}</span>
              </p>
            )}
          </div>

          {/* Campo: Seleção do Curso */}


          {/* Seção Condicional: Envio de Comprovativo Manual */}
          {needsDocument && (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface">
                  Curso de Frequência
                </label>
                <select
                  value={cursoId}
                  onChange={(e) => setCursoId(e.target.value as CourseId)}
                  disabled={loading}
                  className="w-full border border-outline-variant/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2 text-warning text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Anexe o recibo ou declaração de matrícula para validação manual.</span>
                </div>

                {!documento ? (
                  <label className="border-2 border-dashed border-outline-variant/80 hover:border-primary/60 bg-surface-container-lowest rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center">
                    <Upload className="w-6 h-6 text-primary" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-on-surface">Carregar Comprovativo</p>
                      <p className="text-[11px] text-on-surface-variant">PDF, JPG ou PNG (máx. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDocumento(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate">{documento.name}</p>
                        <p className="text-[10px] text-on-surface-variant">
                          {(documento.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocumento(null)}
                      className="p-1 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Botão Principal de Submissão */}
          <button
            type="submit"
            disabled={loading || !!processoError}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A Validar Dados...</span>
              </>
            ) : (
              <>
                <span>Confirmar Matrícula</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Rodapé / Sair da Conta */}
        <div className="border-t border-outline-variant/30 pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => signOut?.()}
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-error transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair ou trocar de conta</span>
          </button>
        </div>

      </div>
    </div>
  );
}