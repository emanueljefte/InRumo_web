import { useMemo, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Download,
  Loader2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { SupabaseAdmissionImportRepository } from '../../data/supabase/SupabaseAdmissionImportRepository';
import { mapCourseNameToId } from '../../data/course/courseNameMapping';
import type { AdmittedStudentRow } from '../../domain/admission/AdmittedStudentImport';

type ExcelRow = {
  'Número de Processo'?: string | number;
  'Nome'?: string;
  'Curso'?: string;
  'Data de Nascimento'?: string | number;
  [key: string]: unknown;
};

interface ParsedDataState {
  validRows: AdmittedStudentRow[];
  errors: string[];
  fileName: string;
  totalRows: number;
}

export default function ImportAdmittedStudentsPage() {
  const admissionImportRepository = useMemo(() => new SupabaseAdmissionImportRepository(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Estados do Fluxo
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Dados Parseados
  const [parsedState, setParsedState] = useState<ParsedDataState | null>(null);

  // Resultado do Bulk Upsert
  const [summary, setSummary] = useState<{ inserted: number; errors: string[] } | null>(null);

  // Reset do fluxo
  const handleReset = () => {
    setParsedState(null);
    setSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Ler e Processar Ficheiro Excel
  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert('Por favor, selecione um ficheiro Excel válido (.xlsx ou .xls).');
      return;
    }

    setParsing(true);
    setSummary(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

      const validRows: AdmittedStudentRow[] = [];
      const parseErrors: string[] = [];

      rows.forEach((row, index) => {
        const rowNum = index + 2; // +2 considerando o cabeçalho
        const processo = row['Número de Processo'] ? String(row['Número de Processo']).trim() : '';
        const nome = row['Nome'] ? String(row['Nome']).trim() : '';
        const cursoRaw = row['Curso'] ? String(row['Curso']).trim() : '';

        if (!processo || !nome || !cursoRaw) {
          parseErrors.push(`Linha ${rowNum}: Campos obrigatórios em falta (Número de Processo, Nome ou Curso).`);
          return;
        }

        try {
          const cursoId = mapCourseNameToId(cursoRaw);
          validRows.push({
            numeroProcesso: processo,
            nome,
            cursoId,
            dataNascimento: row['Data de Nascimento'] ? String(row['Data de Nascimento']).trim() : undefined,
          });
        } catch (err) {
          parseErrors.push(`Linha ${rowNum} [${nome}]: ${err instanceof Error ? err.message : 'Curso não reconhecido.'}`);
        }
      });

      setParsedState({
        validRows,
        errors: parseErrors,
        fileName: file.name,
        totalRows: rows.length
      });
    } catch {
      alert('Ocorreu um erro ao ler o ficheiro Excel. Verifique se a folha não está corrompida.');
    } finally {
      setParsing(false);
    }
  };

  // Executar Importação na Base de Dados
  const handleConfirmImport = async () => {
    if (!parsedState || parsedState.validRows.length === 0) return;

    setUploading(true);
    try {
      const result = await admissionImportRepository.bulkUpsert(parsedState.validRows);
      setSummary({
        inserted: result.inserted,
        errors: [...parsedState.errors, ...(result.errors || [])]
      });
      setParsedState(null); // Limpa o estado de preview após concluir
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao importar alunos.');
    } finally {
      setUploading(false);
    }
  };

  // Descarregar Modelo de Exemplo Excel
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Número de Processo': '2026001',
        'Nome': 'Emanuel Dingani',
        'Curso': 'Engenharia Informática',
        'Data de Nascimento': '2002-05-14'
      },
      {
        'Número de Processo': '2026002',
        'Nome': 'Ana Maria Silva',
        'Curso': 'Engenharia de Telecomunicações',
        'Data de Nascimento': '2001-11-20'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admitidos');
    XLSX.writeFile(workbook, 'Modelo_Importacao_InRumo.xlsx');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/40">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Importar Alunos Admitidos
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant">
            Suba a lista de estudantes aprovados no exame de acesso via documento Excel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Modelo Excel</span>
        </button>
      </div>

      {/* ETAPA 1: AREA DE UPLOAD / DRAG AND DROP */}
      {!parsedState && !summary && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
          }}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-surface-container-lowest ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-outline-variant/80 hover:border-primary/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            disabled={parsing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="space-y-4 max-w-sm mx-auto pointer-events-none">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
              {parsing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <p className="font-heading text-base font-bold text-on-surface">
                {parsing ? 'A analisar o ficheiro...' : 'Clique ou arraste o ficheiro Excel'}
              </p>
              <p className="font-body text-xs text-on-surface-variant">
                Suporta formatos <code className="bg-surface-container-low px-1.5 py-0.5 rounded font-mono">.xlsx</code> e <code className="bg-surface-container-low px-1.5 py-0.5 rounded font-mono">.xls</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 2: PRÉ-VISUALIZAÇÃO E VALIDAÇÃO DOS DADOS */}
      {parsedState && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 space-y-6 shadow-xs animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-on-surface">{parsedState.fileName}</h3>
                <p className="font-body text-xs text-on-surface-variant">
                  {parsedState.totalRows} linha(s) encontrada(s) no total
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
              title="Cancelar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cards de Métricas Pré-Importação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-success/10 border border-success/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>Registos Válidos</span>
              </div>
              <p className="font-heading text-2xl font-bold text-on-surface">
                {parsedState.validRows.length}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${
              parsedState.errors.length > 0
                ? 'bg-error/10 border-error/20'
                : 'bg-surface-container-low border-outline-variant/40'
            }`}>
              <div className={`flex items-center gap-2 text-xs font-bold ${
                parsedState.errors.length > 0 ? 'text-error' : 'text-on-surface-variant'
              }`}>
                <AlertTriangle className="w-4 h-4" />
                <span>Inconsistências / Erros</span>
              </div>
              <p className="font-heading text-2xl font-bold text-on-surface">
                {parsedState.errors.length}
              </p>
            </div>
          </div>

          {/* Erros Detetados na Pré-Visualização */}
          {parsedState.errors.length > 0 && (
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-error">Avisos de Validação:</p>
              <div className="max-h-36 overflow-y-auto bg-error/5 border border-error/15 rounded-2xl p-3 space-y-1.5 custom-scrollbar">
                {parsedState.errors.map((err, i) => (
                  <p key={i} className="text-[11px] font-mono text-error/90 flex items-start gap-1.5">
                    <span className="shrink-0">•</span>
                    <span>{err}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Ações da Pré-visualização */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all cursor-pointer"
            >
              Escolher Outro Ficheiro
            </button>

            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={uploading || parsedState.validRows.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A Processar na Base de Dados...</span>
                </>
              ) : (
                <>
                  <span>Confirmar e Importar ({parsedState.validRows.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ETAPA 3: RELATÓRIO FINAL DE IMPORTAÇÃO */}
      {summary && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 space-y-6 shadow-xs animate-scaleIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-success/10 text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-on-surface">Importação Concluída</h3>
                <p className="font-body text-xs text-on-surface-variant">
                  Resumo das operações realizadas no sistema.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nova Importação</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-success/10 border border-success/20 flex items-center gap-3">
            <FileText className="w-5 h-5 text-success shrink-0" />
            <p className="font-body text-xs sm:text-sm font-semibold text-on-surface">
              <strong className="text-success text-base">{summary.inserted}</strong> registo(s) foram inseridos ou atualizados com sucesso.
            </p>
          </div>

          {/* Erros Finais */}
          {summary.errors.length > 0 && (
            <div className="space-y-2">
              <p className="font-body text-xs font-bold text-error flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{summary.errors.length} erro(s) não processados:</span>
              </p>
              <div className="max-h-48 overflow-y-auto bg-surface-container-low border border-outline-variant/40 rounded-2xl p-4 space-y-2">
                <ul className="text-xs text-on-surface-variant space-y-1 font-mono">
                  {summary.errors.map((err, i) => (
                    <li key={i} className="flex items-start gap-2 border-b border-outline-variant/20 pb-1 last:border-none">
                      <span className="text-error font-bold">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}