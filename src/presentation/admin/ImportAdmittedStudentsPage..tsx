import * as XLSX from 'xlsx'; // já está na tua stack de artifacts, mas aqui é dependência real do projeto
import type { AdmittedStudentRow } from '../../domain/admission/AdmittedStudentImport';
import { useMemo, useState } from 'react';
import { SupabaseAdmissionImportRepository } from '../../data/supabase/SupabaseAdmissionImportRepository';
import { mapCourseNameToId } from '../../data/course/courseNameMapping';

type ExcelRow = {
  'Número de Processo': string;
  'Nome': string;
  'Curso': string;
  'Data de Nascimento'?: string;
};

export default function ImportAdmittedStudentsPage() {
  const admissionImportRepository = useMemo(() => new SupabaseAdmissionImportRepository(), []);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ inserted: number; errors: string[] } | null>(null);

  async function handleFileUpload(file: File) {
    setLoading(true);
    setSummary(null);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    const parsed: AdmittedStudentRow[] = [];
    const parseErrors: string[] = [];

    rows.forEach((row, index) => {
      try {
        parsed.push({
          numeroProcesso: row['Número de Processo'],
          nome: row['Nome'],
          cursoId: mapCourseNameToId(row['Curso']),
          dataNascimento: row['Data de Nascimento'],
        });
      } catch (err) {
        // linha 1 é o cabeçalho, por isso +2 para corresponder ao número real no Excel
        parseErrors.push(`Linha ${index + 2}: ${err instanceof Error ? err.message : 'erro desconhecido'}`);
      }
    });

    const result = await admissionImportRepository.bulkUpsert(parsed);
    setSummary({ inserted: result.inserted, errors: [...parseErrors, ...result.errors] });
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="font-heading text-headline-lg text-on-surface">Importar alunos admitidos</h1>

      <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-8 text-center space-y-3">
        <p className="font-body-sm text-on-surface-variant">Seleciona o ficheiro Excel com os admitidos</p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          disabled={loading}
          className="font-body-sm"
        />
      </div>

      {loading && <p className="font-body-sm text-on-surface-variant">A importar...</p>}

      {summary && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 space-y-3">
          <p className="font-body-sm text-primary font-medium">{summary.inserted} registos importados com sucesso.</p>

          {summary.errors.length > 0 && (
            <div className="space-y-1">
              <p className="font-body-sm text-error font-medium">{summary.errors.length} erro(s):</p>
              <ul className="text-xs text-on-surface-variant space-y-1 max-h-40 overflow-y-auto">
                {summary.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}