import React, { useState } from 'react';
import { 
  Bell, 
  UploadCloud, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight,
  MoreVertical 
} from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  category: string;
  type: 'pdf' | 'image';
  dateUploaded: string;
  size: string;
  status: 'Approved' | 'In Review' | 'Rejected';
}

const RECENT_DOCUMENTS: UploadedDocument[] = [
  {
    id: '1',
    name: 'Identity_Card_Front.pdf',
    category: 'Identity Document',
    type: 'pdf',
    dateUploaded: 'Oct 24, 2023',
    size: '2.4 MB',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'Proof_of_Address_Utility.jpg',
    category: 'Proof of Address',
    type: 'image',
    dateUploaded: 'Oct 25, 2023',
    size: '1.1 MB',
    status: 'In Review',
  },
];

export default function CandidateDocumentsPage() {
  const [isDragging, setIsDragging] = useState(false);

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
      
      {/* Topo Superior: Notificações & Foto de Perfil */}
      <div className="flex justify-end items-center gap-3">
        <button 
          type="button"
          className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
          alt="Perfil do utilizador"
          className="w-9 h-9 rounded-full object-cover border border-[#e8e7f1]"
        />
      </div>

      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Documentos
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Upload and manage necessary files for your application process. Ensure all required documents are clear and legible.
        </p>
      </div>

      {/* GRID PRINCIPAL: AREA DE UPLOAD + SIDEBAR DE STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA ESQUERDA: ÁREA DE UPLOAD (DRAG & DROP) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-4">
          <h2 className="font-heading text-base font-bold text-[#1a1b22]">
            Upload New Document
          </h2>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center space-y-4 ${
              isDragging
                ? 'border-[#7e5700] bg-[#fbf5e8]/60'
                : 'border-[#e8e7f1] bg-[#f4f2fd]/30 hover:border-[#d4c4b0]'
            }`}
          >
            {/* Ícone de Upload */}
            <div className="w-14 h-14 rounded-full bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center border border-[#d4c4b0]/40">
              <UploadCloud className="w-7 h-7 stroke-[1.8]" />
            </div>

            {/* Instruções */}
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-[#1a1b22]">
                Drag and drop files here
              </h3>
              <p className="font-body text-xs text-[#827564]">
                or click to browse from your device
              </p>
            </div>

            {/* Botão Select Files */}
            <div className="pt-2">
              <label className="cursor-pointer inline-block bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl shadow-xs transition-all duration-150">
                <span>Select Files</span>
                <input type="file" className="hidden" multiple />
              </label>
            </div>

            {/* Formatos Suportados */}
            <p className="text-[11px] text-[#827564]">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* COLUNA DIREITA: PROGRESSO DA CANDIDATURA & AJUDA */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Application Progress */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs space-y-5">
            
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-[#1a1b22]">
                Application Progress
              </h3>
              <span className="font-heading text-sm font-bold text-[#7e5700]">
                2 / 4
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-[#eeedf7] h-2 rounded-full overflow-hidden">
              <div className="bg-[#7e5700] h-full rounded-full w-1/2" />
            </div>

            {/* Lista de Documentos Exigidos */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#827564] block">
                Required Documents
              </span>

              <div className="space-y-2.5 text-xs font-semibold">
                
                {/* Identity Card (Concluído) */}
                <div className="flex items-center gap-2.5 text-[#1a1b22] line-through decoration-[#827564]/60">
                  <CheckCircle2 className="w-4 h-4 text-[#7e5700] shrink-0" />
                  <span>Identity Card</span>
                </div>

                {/* Proof of Address (Concluído) */}
                <div className="flex items-center gap-2.5 text-[#1a1b22] line-through decoration-[#827564]/60">
                  <CheckCircle2 className="w-4 h-4 text-[#7e5700] shrink-0" />
                  <span>Proof of Address</span>
                </div>

                {/* Certificate of Grades (Pendente) */}
                <div className="flex items-center gap-2.5 text-[#504536]">
                  <Circle className="w-4 h-4 text-[#827564] shrink-0" />
                  <span>Certificate of Grades</span>
                </div>

                {/* Motivation Letter (Pendente) */}
                <div className="flex items-center gap-2.5 text-[#504536]">
                  <Circle className="w-4 h-4 text-[#827564] shrink-0" />
                  <span>Motivation Letter</span>
                </div>

              </div>
            </div>

          </div>

          {/* Card: Need Help? */}
          <div className="bg-[#f4f2fd]/50 rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#eeedf7] text-[#504536] flex items-center justify-center">
              <HelpCircle size={18} />
            </div>

            <h4 className="font-heading text-base font-bold text-[#1a1b22]">
              Need Help?
            </h4>

            <p className="font-body text-xs text-[#504536] leading-relaxed">
              Check our guidelines for acceptable document formats and quality requirements.
            </p>

            <a
              href="#guidelines"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7e5700] hover:underline pt-1"
            >
              <span>View Guidelines</span>
              <ArrowRight size={14} />
            </a>
          </div>

        </div>

      </div>

      {/* SEÇÃO: RECENTLY UPLOADED */}
      <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-6">
        
        <h2 className="font-heading text-base font-bold text-[#1a1b22]">
          Recently Uploaded
        </h2>

        {/* Tabela de Ficheiros */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            
            {/* Header */}
            <thead>
              <tr className="border-b border-[#e8e7f1] text-[#827564] text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Document Name</th>
                <th className="pb-3 font-semibold">Date Uploaded</th>
                <th className="pb-3 font-semibold">Size</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            {/* Linhas da Tabela */}
            <tbody className="divide-y divide-[#e8e7f1]/60">
              {RECENT_DOCUMENTS.map((doc) => (
                <tr key={doc.id} className="group hover:bg-[#fbf8ff]/60 transition-colors">
                  
                  {/* Nome do Documento & Categoria */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f4f2fd] text-[#504536] flex items-center justify-center shrink-0 border border-[#e8e7f1]">
                        {doc.type === 'pdf' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-[#1a1b22] block">
                          {doc.name}
                        </span>
                        <span className="text-[11px] text-[#827564]">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Data de Envio */}
                  <td className="py-4 px-2 text-[#504536] font-medium">
                    {doc.dateUploaded}
                  </td>

                  {/* Tamanho */}
                  <td className="py-4 px-2 text-[#504536] font-medium">
                    {doc.size}
                  </td>

                  {/* Badge de Estado */}
                  <td className="py-4 px-2">
                    {doc.status === 'Approved' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e8f5e9] text-[#2e7d32]">
                        <CheckCircle2 size={12} />
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#fbf5e8] text-[#7e5700] border border-[#d4c4b0]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7e5700]" />
                        In Review
                      </span>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="py-4 pl-2 text-right">
                    <button
                      type="button"
                      className="p-1.5 text-[#827564] hover:text-[#1a1b22] hover:bg-[#f4f2fd] rounded-lg transition-colors"
                      aria-label="Opções"
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