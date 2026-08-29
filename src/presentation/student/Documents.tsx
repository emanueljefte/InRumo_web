import React, { useState } from 'react';
import { 
  UploadCloud, 
  Search, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2 
} from 'lucide-react';

interface DocumentFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'image';
  uploadDate: string;
  size: string;
  status: 'Em análise' | 'Enviado';
}

const INITIAL_DOCUMENTS: DocumentFile[] = [
  {
    id: '1',
    name: 'Certificado de Notas.pdf',
    type: 'pdf',
    uploadDate: '24 Out, 2023',
    size: '1.2 MB',
    status: 'Em análise',
  },
  {
    id: '2',
    name: 'Currículo_V2.pdf',
    type: 'pdf',
    uploadDate: '22 Out, 2023',
    size: '845 KB',
    status: 'Enviado',
  },
  {
    id: '3',
    name: 'Carta_Motivacao.docx',
    type: 'docx',
    uploadDate: '15 Out, 2023',
    size: '42 KB',
    status: 'Enviado',
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_DOCUMENTS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Lógica para upload de ficheiros
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      
      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Documentos de Apoio
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Faça o upload e gira os documentos necessários para as suas sessões de orientação vocacional.
        </p>
      </div>

      {/* ZONA DE UPLOAD (DRAG & DROP) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-[#f4f2fd]/50 border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-[#7e5700] bg-[#fbf5e8]/60'
            : 'border-[#d4c4b0]/80 hover:border-[#7e5700]'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          
          {/* Ícone de Nuvem */}
          <div className="w-16 h-16 rounded-full bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center mx-auto border border-[#d4c4b0]/40">
            <UploadCloud className="w-8 h-8 stroke-[1.8]" />
          </div>

          {/* Texto Principal */}
          <div className="space-y-1.5">
            <h2 className="font-heading text-lg font-bold text-[#1a1b22]">
              Arraste e solte ficheiros aqui
            </h2>
            <p className="font-body text-xs text-[#827564]">
              ou clique para procurar no seu computador (PDF, DOCX, JPG até 10MB)
            </p>
          </div>

          {/* Botão de Upload */}
          <div className="pt-2">
            <label className="cursor-pointer inline-block bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl shadow-xs transition-all duration-150">
              <span>Procurar Ficheiros</span>
              <input type="file" className="hidden" multiple />
            </label>
          </div>

        </div>
      </div>

      {/* SEÇÃO FICHEIROS RECENTES */}
      <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Cabeçalho da Tabela & Pesquisa */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-bold text-[#1a1b22]">
            Ficheiros Recentes
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827564]" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f4f2fd]/60 focus:bg-white text-xs text-[#1a1b22] placeholder:text-[#827564]/70 pl-9 pr-4 py-2 rounded-xl border border-transparent focus:border-[#7e5700] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Tabela de Ficheiros */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            
            {/* Header da Tabela */}
            <thead>
              <tr className="border-b border-[#e8e7f1] text-[#827564] font-medium text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Nome do Documento</th>
                <th className="pb-3 font-semibold">Data de Envio</th>
                <th className="pb-3 font-semibold">Tamanho</th>
                <th className="pb-3 font-semibold">Estado</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>

            {/* Linhas da Tabela */}
            <tbody className="divide-y divide-[#e8e7f1]/60">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="group hover:bg-[#fbf8ff]/60 transition-colors">
                  
                  {/* Nome do Ficheiro + Ícone */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          doc.type === 'pdf'
                            ? 'bg-[#fee2e2] text-[#dc2626]'
                            : 'bg-[#e0f2fe] text-[#0284c7]'
                        }`}
                      >
                        <FileText className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="font-heading font-semibold text-[#1a1b22] truncate max-w-[220px] sm:max-w-xs">
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  {/* Data de Envio */}
                  <td className="py-4 px-2 text-[#504536] font-medium">
                    {doc.uploadDate}
                  </td>

                  {/* Tamanho */}
                  <td className="py-4 px-2 text-[#504536] font-medium">
                    {doc.size}
                  </td>

                  {/* Badge de Estado */}
                  <td className="py-4 px-2">
                    {doc.status === 'Em análise' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#f4f2fd] text-[#504536] border border-[#e8e7f1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#827564]" />
                        Em análise
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#fbf5e8] text-[#7e5700] border border-[#d4c4b0]/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7e5700]" />
                        Enviado
                      </span>
                    )}
                  </td>

                  {/* Menu de Ações */}
                  <td className="py-4 pl-2 text-right">
                    <button
                      type="button"
                      className="p-1.5 text-[#827564] hover:text-[#1a1b22] hover:bg-[#f4f2fd] rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
}