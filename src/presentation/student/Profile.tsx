import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Camera, 
  Pencil, 
  ChevronRight, 
  Lock, 
  ShieldCheck, 
  GraduationCap, 
  User, 
  Settings 
} from 'lucide-react';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'Emanuel Jefté',
    email: 'emanueljefte@instic.edu.ao',
    phone: '+244 923 000 000',
    birthDate: '2002-04-12',
    studentCode: '20240192',
    institution: 'INSTIC - Instituto Superior de Tecnologias',
    course: 'Engenharia Informática',
    academicYear: '3.º Ano',
    shift: 'Manhã',
    gpa: '8.5',
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      
      {/* Barra de Pesquisa Superior & Notificação */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827564]" />
          <input
            type="text"
            placeholder="Buscar configurações..."
            className="w-full bg-white border border-[#e8e7f1] text-xs text-[#1a1b22] placeholder:text-[#827564]/70 pl-11 pr-4 py-3 rounded-full focus:outline-none focus:border-[#7e5700] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            alt="Avatar Emanuel Jefté"
            className="w-9 h-9 rounded-full object-cover border border-[#e8e7f1]"
          />
        </div>
      </div>

      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Configurações de Perfil
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Gerencie suas informações pessoais e académicas do instituto.
        </p>
      </div>

      {/* Grid Principal do Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA DA ESQUERDA: Avatar & Conta */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card Avatar & Bio */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 text-center space-y-4 shadow-2xs">
            <div className="relative w-28 h-28 mx-auto">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                alt="Emanuel Jefté"
                className="w-full h-full rounded-full object-cover border-2 border-[#e8e7f1]"
              />
              <button 
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-[#7e5700] hover:bg-[#604100] text-white rounded-full shadow-xs transition-colors"
                title="Alterar fotografia"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-[#1a1b22]">
                {formData.fullName}
              </h2>
              <p className="font-body text-xs text-[#827564]">
                Estudante do {formData.academicYear} • INSTIC
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#d4c4b0]/40">
                Engenharia
              </span>
              <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#d4c4b0]/40">
                Tecnologia
              </span>
            </div>
          </div>

          {/* Card Configurações de Conta */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-[#1a1b22]">
              <Settings className="w-4 h-4 text-[#7e5700]" />
              <h3 className="font-heading text-sm font-bold">Conta</h3>
            </div>

            <div className="space-y-1 divide-y divide-[#e8e7f1]/60">
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-xs font-medium text-[#504536] hover:text-[#1a1b22] transition-colors"
              >
                <span>Alterar Senha</span>
                <ChevronRight size={16} className="text-[#827564]" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-xs font-medium text-[#504536] hover:text-[#1a1b22] transition-colors"
              >
                <span>Preferências de Notificação</span>
                <ChevronRight size={16} className="text-[#827564]" />
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-xs font-medium text-[#504536] hover:text-[#1a1b22] transition-colors"
              >
                <span>Privacidade dos Dados</span>
                <ChevronRight size={16} className="text-[#827564]" />
              </button>
            </div>
          </div>

        </div>

        {/* COLUNA DA DIREITA: Informações Pessoais & Histórico Académico */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Informações Pessoais */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 space-y-6 shadow-2xs">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1a1b22]">
                <User className="w-5 h-5 text-[#7e5700]" />
                <h3 className="font-heading text-base font-bold">
                  Informações Pessoais
                </h3>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-[#7e5700] hover:underline"
              >
                <Pencil size={14} />
                Editar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Email Institucional
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                />
              </div>
            </div>

          </div>

          {/* Histórico Académico (INSTIC) */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 space-y-6 shadow-2xs">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1a1b22]">
                <GraduationCap className="w-5 h-5 text-[#7e5700]" />
                <h3 className="font-heading text-base font-bold">
                  Histórico Académico
                </h3>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-[#7e5700] hover:underline"
              >
                <Pencil size={14} />
                Atualizar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-medium text-[#827564]">
                  Instituição Atual
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.institution}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-semibold text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Código / Nº de Estudante
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.studentCode}
                  className="w-full bg-[#f4f2fd]/60 font-mono text-xs font-bold text-[#7e5700] px-4 py-3 rounded-xl border border-transparent cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Curso
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Ano Académico
                </label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                >
                  <option value="1.º Ano">1.º Ano</option>
                  <option value="2.º Ano">2.º Ano</option>
                  <option value="3.º Ano">3.º Ano</option>
                  <option value="4.º Ano">4.º Ano</option>
                  <option value="5.º Ano">5.º Ano</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#827564]">
                  Turno
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  className="w-full bg-[#f4f2fd]/60 text-xs font-medium text-[#1a1b22] px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#7e5700] focus:outline-none transition-all"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Pós-Laboral">Pós-Laboral</option>
                </select>
              </div>

            </div>

            {/* Desempenho Geral / Média Global */}
            <div className="pt-4 border-t border-[#e8e7f1]/60 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#827564]">Desempenho Geral (Média)</span>
                <span className="font-heading font-bold text-[#1a1b22]">
                  <strong className="text-sm text-[#7e5700]">{formData.gpa}</strong> / 10
                </span>
              </div>

              <div className="w-full bg-[#f4f2fd] h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#7e5700] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(parseFloat(formData.gpa) / 10) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-[#827564] text-right">
                Bom aproveitamento em disciplinas de Desenvolvimento de Software.
              </p>
            </div>

          </div>

          {/* Botões de Ação (Descartar / Salvar) */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-[#d4c4b0] text-xs font-semibold text-[#504536] hover:bg-[#f4f2fd] transition-colors"
            >
              Descartar
            </button>

            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-xs font-semibold shadow-xs transition-all"
            >
              Salvar Alterações
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}