// presentation/auth/CompleteEnrollmentPage.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../application/auth/useAuth';
import { completeMatriculadoVerification } from '../../application/auth/registerMatriculado';
import { SupabaseAdmissionVerificationRepository } from '../../data/supabase/SupabaseAdmissionVerificationRepository';
import { SupabaseEnrollmentDocumentRepository } from '../../data/supabase/SupabaseEnrollmentDocumentRepository';
import type { CourseId } from '../../domain/test/TestQuestion';

export default function CompleteEnrollmentPage() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const admissionRepo = useMemo(() => new SupabaseAdmissionVerificationRepository(), []);
  const documentRepo = useMemo(() => new SupabaseEnrollmentDocumentRepository(), []);

  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [cursoId, setCursoId] = useState<CourseId>('eng-informatica');
  const [documento, setDocumento] = useState<File | null>(null);
  const [needsDocument, setNeedsDocument] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;

    setError(null);
    setLoading(true);
    try {
      const result = await completeMatriculadoVerification(
        session.user.id,
        { nome: profile.nome, numeroProcesso, cursoId, documento: documento ?? undefined },
        admissionRepo,
        documentRepo,
      );

      if (result.status === 'verified') {
        navigate('/student', { replace: true });
      } else if (result.status === 'pending') {
        navigate('/pending-verification', { replace: true });
      } else {
        setNeedsDocument(true);
      }
    } catch {
      setError('Não foi possível validar a matrícula. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-5">
        <h1 className="font-heading text-headline-md text-on-surface">Completar matrícula</h1>
        <p className="font-body-sm text-on-surface-variant">
          A tua conta foi criada, mas ainda falta confirmar a tua matrícula.
        </p>

        {error && <p className="font-body-sm text-error">{error}</p>}

        <div className="space-y-1">
          <label className="font-body-sm text-on-surface-variant">Número de processo</label>
          <input value={numeroProcesso} onChange={(e) => setNumeroProcesso(e.target.value)} required
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm" />
        </div>

        <div className="space-y-1">
          <label className="font-body-sm text-on-surface-variant">Curso</label>
          <select value={cursoId} onChange={(e) => setCursoId(e.target.value as CourseId)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm">
            <option value="eng-informatica">Engenharia Informática</option>
            <option value="eng-telecom">Engenharia de Telecomunicações</option>
            <option value="informatica-gestao">Informática de Gestão</option>
          </select>
        </div>

        {needsDocument && (
          <div className="space-y-1">
            <label className="font-body-sm text-on-surface-variant">
              Não te encontrámos na lista de admitidos — envia um comprovativo de matrícula
            </label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setDocumento(e.target.files?.[0] ?? null)}
              required className="font-body-sm" />
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl disabled:opacity-50">
          {loading ? 'A validar...' : 'Confirmar matrícula'}
        </button>
      </form>
    </div>
  );
}