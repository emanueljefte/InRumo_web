import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Download,
  Loader2,
  Calendar,
  FileCode2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import { SupabaseDocumentRepository } from '../../data/supabase/SupabaseDocumentRepository';
import type { OrientationSession } from '../../domain/schedule/OrientationSession';
import type { SessionDocument } from '../../domain/schedule/Document';

function formatBytes(bytes?: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext || '')) {
    return <ImageIcon className="w-5 h-5 text-purple-500 shrink-0" />;
  }
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
    return <FileText className="w-5 h-5 text-primary shrink-0" />;
  }
  return <FileCode2 className="w-5 h-5 text-on-surface-variant shrink-0" />;
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const scheduleRepository = useMemo(() => new SupabaseScheduleRepository(), []);
  const documentRepository = useMemo(() => new SupabaseDocumentRepository(), []);

  const [sessions, setSessions] = useState<OrientationSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<SessionDocument[] | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Carregar Sessões
  useEffect(() => {

  const currentSession = session?.user
  let isMounted = true;

  async function loadSessions() {
    try {
      const userSessions = await scheduleRepository.getSessionsForMatriculado(currentSession!.id);
      if (!isMounted) return;

      const validSessions = userSessions.filter((x) => x.estado !== 'cancelada');
      setSessions(validSessions);

      if (validSessions.length > 0) {
        setSelectedSessionId(validSessions[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar sessões:', err);
      if (isMounted) setSessions([]); // marca como "buscado, mas vazio/erro" para não ficar em loading eterno
    }
  }

  loadSessions();

  return () => {
    isMounted = false;
  };
}, [session?.user?.id, scheduleRepository]);

const loading = Boolean(session?.user?.id) && sessions === undefined;
  // Carregar Documentos da Sessão Selecionada
useEffect(() => {
  if (!selectedSessionId) return;

  let isMounted = true;

  documentRepository
    .getDocuments(selectedSessionId)
    .then((docs) => {
      if (isMounted) setDocuments(docs);
    })
    .catch((err) => {
      console.error('Erro ao carregar documentos:', err);
      if (isMounted) setDocuments([]);
    });

  return () => {
    isMounted = false;
  };
}, [selectedSessionId, documentRepository]);

const docsLoading = documents === undefined;

  const handleUpload = useCallback(
    async (file: File) => {
      const userId = session?.user?.id;
      if (!selectedSessionId || typeof userId !== 'string' || uploading) return;

      setUploading(true);
      setUploadSuccess(false);

      try {
        await documentRepository.uploadDocument(selectedSessionId, userId, file);
        const updatedDocs = await documentRepository.getDocuments(selectedSessionId);
        setDocuments(updatedDocs);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        console.error('Erro no upload do documento:', err);
      } finally {
        setUploading(false);
      }
    },
    [selectedSessionId, session?.user?.id, uploading, documentRepository]
  );

  const handleDownload = async (doc: SessionDocument) => {
    try {
      const url = await documentRepository.getDownloadUrl(doc.filePath);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Erro ao descarregar documento:', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
          A carregar os teus documentos...
        </p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4 space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <FolderOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-on-surface">
            Nenhuma sessão encontrada
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Os teus documentos ficam organizados dentro das tuas sessões de orientação. Agenda uma sessão para poderes partilhar ficheiros com o teu orientador.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/schedule')}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agendar Sessão de Orientação</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 animate-fadeIn">
      {/* Título e Descrição */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
          Documentos
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Gere os ficheiros e relatórios associados às tuas sessões de orientação.
        </p>
      </div>

      {/* Tabs / Seletor de Sessões */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">
          Sessão de Orientação
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {sessions.map((s) => {
            const isSelected = selectedSessionId === s.id;
            const formattedDate = new Date(s.dataHora).toLocaleDateString('pt-PT', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSessionId(s.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-outline-variant/40'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Sessão de {formattedDate}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cartão de Ficheiros */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
          <h2 className="font-heading text-base font-bold text-on-surface">
            Ficheiros Guardados
          </h2>
          <span className="text-xs font-medium text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
            {(documents ?? []).length} {(documents ?? []).length === 1 ? 'ficheiro' : 'ficheiros'}
          </span>
        </div>

        {/* Lista de Documentos */}
        {docsLoading ? (
          <div className="py-8 flex justify-center items-center gap-2 text-xs text-on-surface-variant font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>A atualizar ficheiros...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-on-surface-variant/50 mx-auto" />
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Nenhum documento adicionado nesta sessão.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-surface-container-low/60 hover:bg-surface-container-low border border-outline-variant/40 rounded-2xl p-3.5 sm:p-4 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center shrink-0">
                    {getFileIcon(doc.fileName)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold text-xs sm:text-sm text-on-surface truncate">
                      {doc.fileName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant flex items-center gap-2">
                      {doc.fileSize && <span>{formatBytes(doc.fileSize)}</span>}
                      {doc.createdAt && (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(doc.createdAt).toLocaleDateString('pt-PT')}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(doc)}
                  className="p-2.5 rounded-xl bg-surface-container-lowest hover:bg-primary/10 text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer shrink-0"
                  aria-label={`Descarregar ${doc.fileName}`}
                  title="Descarregar ficheiro"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Zona de Upload Dropzone */}
        <div className="space-y-2 pt-2">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2.5 border-2 border-dashed rounded-2xl p-6 sm:p-8 cursor-pointer transition-all text-center relative ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant/80 hover:border-primary hover:bg-surface-container-low/50'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleUpload(e.target.files[0]);
                  e.target.value = ''; // Reset do input
                }
              }}
            />

            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  A enviar o ficheiro...
                </span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex flex-col items-center space-y-1 text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
                <span className="text-xs sm:text-sm font-bold">
                  Documento enviado com sucesso!
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-on-surface">
                    Clica para enviar ou arrasta o ficheiro para aqui
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Suporta relatórios, imagens e documentos (PDF, DOCX, PNG) até 10MB
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}