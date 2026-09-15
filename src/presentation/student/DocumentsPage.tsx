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
  FolderOpen,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseScheduleRepository } from '../../data/supabase/SupabaseScheduleRepository';
import { SupabaseDocumentRepository } from '../../data/supabase/SupabaseDocumentRepository';
import type { OrientationSession } from '../../domain/schedule/OrientationSession';
import type { SessionDocument } from '../../domain/schedule/Document';
import { supabase } from '../../api/supabase';

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
    return <ImageIcon className="w-5 h-5 text-tertiary shrink-0" />;
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

  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'session' | 'chat'>('session');
  const currentUserId = session?.user?.id;
  const [loadingSessions, setLoadingSessions] = useState(() => Boolean(currentUserId));

  // 1. Carregar Chat do Utilizador
  useEffect(() => {
    const userId = session?.user?.id;
    if (typeof userId !== 'string') return;

    supabase
      .from('chats')
      .select('id')
      .eq('user_id', userId)
      .neq('status', 'closed')
      .maybeSingle()
      .then(({ data }) => setChatId(data?.id ?? null));
  }, [session?.user?.id]);

  // 2. Carregar Sessões de Orientação
  useEffect(() => {
    if (!currentUserId) return;

    let isMounted = true;

    async function loadSessions(userId: string) {
      // 1. Atualização do loading feita de forma segura no início da rotina
      if (isMounted) setLoadingSessions(true);

      try {
        const userSessions = await scheduleRepository.getSessionsForMatriculado(userId);
        if (!isMounted) return;

        const validSessions = userSessions.filter((x) => x.estado !== 'cancelada');
        setSessions(validSessions);

        if (validSessions.length > 0) {
          setSelectedSessionId(validSessions[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar sessões:', err);
        if (isMounted) setSessions([]);
      } finally {
        if (isMounted) setLoadingSessions(false);
      }
    }

    loadSessions(currentUserId);

    return () => {
      isMounted = false;
    };
  }, [currentUserId, scheduleRepository]);

  // 3. Carregar Documentos consoante a Tab Selecionada
  useEffect(() => {
    let isMounted = true;

    async function fetchDocs() {
      if (selectedTab === 'session' && selectedSessionId) {
        try {
          const docs = await documentRepository.getDocuments(selectedSessionId);
          if (isMounted) setDocuments(docs);
        } catch (err) {
          console.error('Erro ao carregar documentos da sessão:', err);
          if (isMounted) setDocuments([]);
        }
      } else if (selectedTab === 'chat' && chatId) {
        try {
          const docs = await documentRepository.getChatDocuments(chatId);
          if (isMounted) setDocuments(docs);
        } catch (err) {
          console.error('Erro ao carregar documentos do chat:', err);
          if (isMounted) setDocuments([]);
        }
      } else {
        if (isMounted) setDocuments([]);
      }
    }

    fetchDocs();

    return () => {
      isMounted = false;
    };
  }, [selectedTab, selectedSessionId, chatId, documentRepository]);

  const docsLoading = documents === undefined;

  // 4. Gestão de Upload por Origem
  const handleUpload = useCallback(
    async (file: File) => {
      const userId = session?.user?.id;
      if (typeof userId !== 'string' || uploading) return;

      setUploading(true);
      setUploadSuccess(false);

      try {
        if (selectedTab === 'session' && selectedSessionId) {
          await documentRepository.uploadDocument(selectedSessionId, userId, file);
          setDocuments(await documentRepository.getDocuments(selectedSessionId));
        } else if (selectedTab === 'chat' && chatId) {
          await documentRepository.uploadChatDocument(chatId, userId, file);
          setDocuments(await documentRepository.getChatDocuments(chatId));
        } else {
          return;
        }
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        console.error('Erro no upload do documento:', err);
      } finally {
        setUploading(false);
      }
    },
    [selectedTab, selectedSessionId, chatId, session?.user?.id, uploading, documentRepository]
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

  if (loadingSessions) {
    return (
      <div className="max-w-2xl mx-auto py-20 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
        <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
          A organizar os teus documentos e sessões...
        </p>
      </div>
    );
  }

  if (sessions.length === 0 && !chatId) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-lg shadow-primary/5">
          <FolderOpen className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            Nenhum documento disponível
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed">
            Os teus ficheiros ficam associados às tuas conversas de chat e sessões de orientação agendadas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/schedule')}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-md shadow-primary/20 cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agendar Sessão de Orientação</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 animate-fadeIn font-body text-on-surface">
      {/* TÍTULO E DESCRIÇÃO */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Documentos
          </h1>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant/80">
          Gere os ficheiros, relatórios e anexos partilhados na plataforma.
        </p>
      </div>

      {/* SELETOR DE ORIGEM (TABS) */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-3 sm:p-4 space-y-4 shadow-xs">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 flex items-center gap-1.5 px-1">
            <Layers size={13} className="text-primary" /> Origem do Ficheiro
          </label>
          <div className="grid grid-cols-2 gap-2 bg-surface-container-low/60 p-1.5 rounded-2xl border border-outline-variant/20">
            <button
              type="button"
              onClick={() => setSelectedTab('session')}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${selectedTab === 'session'
                  ? 'bg-primary text-on-primary shadow-xs shadow-primary/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                }`}
            >
              <Calendar size={15} />
              <span>Sessões ({sessions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTab('chat')}
              disabled={!chatId}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${selectedTab === 'chat'
                  ? 'bg-primary text-on-primary shadow-xs shadow-primary/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                }`}
            >
              <MessageSquare size={15} />
              <span>Chat Directo</span>
            </button>
          </div>
        </div>

        {/* SUB-SELETOR DE SESSÕES (QUANDO 'SESSION' ESTÁ ATIVO) */}
        {selectedTab === 'session' && sessions.length > 0 && (
          <div className="space-y-1.5 pt-1 animate-fadeIn">
            <span className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-wider px-1">
              Seleciona a Sessão:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${isSelected
                        ? 'bg-primary-container text-on-primary-container border-primary/40 shadow-2xs'
                        : 'bg-surface-container-low/80 hover:bg-surface-container text-on-surface-variant border-outline-variant/30'
                      }`}
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-primary" />
                    <span>Sessão de {formattedDate}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CARTÃO DE FICHEIROS */}
      <div className="bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="font-heading text-base font-bold text-on-surface">
            Ficheiros Guardados
          </h2>
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            {(documents ?? []).length} {(documents ?? []).length === 1 ? 'ficheiro' : 'ficheiros'}
          </span>
        </div>

        {/* LISTA DE DOCUMENTOS */}
        {docsLoading ? (
          <div className="py-10 flex justify-center items-center gap-2 text-xs text-on-surface-variant font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>A atualizar lista de ficheiros...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-10 text-center space-y-2 border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-low/20">
            <AlertCircle className="w-8 h-8 text-on-surface-variant/40 mx-auto" />
            <p className="text-xs sm:text-sm font-medium text-on-surface-variant/80">
              Nenhum documento associado a esta origem.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-surface-container-low/50 hover:bg-surface-container-low border border-outline-variant/30 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 group shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div className="w-11 h-11 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center shrink-0 shadow-2xs">
                    {getFileIcon(doc.fileName)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold text-xs sm:text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {doc.fileName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant/70 flex items-center gap-2 font-medium">
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
                  className="p-2.5 rounded-xl bg-surface-container-lowest hover:bg-primary/10 text-on-surface-variant hover:text-primary border border-outline-variant/30 transition-all cursor-pointer shrink-0 active:scale-95 shadow-2xs"
                  aria-label={`Descarregar ${doc.fileName}`}
                  title="Descarregar ficheiro"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ZONA DE UPLOAD DROPZONE */}
        <div className="space-y-2 pt-2">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2.5 border-2 border-dashed rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 text-center relative ${isDragging
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-outline-variant/40 hover:border-primary/60 hover:bg-surface-container-low/40'
              } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleUpload(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />

            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-xs sm:text-sm font-bold text-primary">
                  A enviar o ficheiro...
                </span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex flex-col items-center space-y-1 text-emerald-600 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8" />
                <span className="text-xs sm:text-sm font-bold">
                  Documento guardado com sucesso!
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 text-primary border border-primary/20 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-on-surface">
                    Clica para enviar ou arrasta o ficheiro para aqui
                  </p>
                  <p className="text-[11px] text-on-surface-variant/70 font-medium">
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