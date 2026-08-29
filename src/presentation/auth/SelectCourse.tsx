import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Factory, 
  Compass, 
  Palette, 
  Wifi, 
  Briefcase, 
  Check, 
  ArrowLeft 
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Engenharia Informática',
    category: 'Tecnologias de Informação',
    icon: Terminal,
  },
  {
    id: '2',
    title: 'Gestão Industrial',
    category: 'Produção e Operações',
    icon: Factory,
  },
  {
    id: '3',
    title: 'Engenharia Civil',
    category: 'Construção e Projetos',
    icon: Compass,
  },
  {
    id: '4',
    title: 'Design Multimédia',
    category: 'Comunicação e Artes Visuais',
    icon: Palette,
  },
  {
    id: '5',
    title: 'Engenharia de Redes',
    category: 'Redes e Telecomunicações',
    icon: Wifi,
  },
  {
    id: '6',
    title: 'Gestão de Empresas',
    category: 'Negócios e Gestão',
    icon: Briefcase,
  },
];

export default function SelectCoursePage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCourses = COURSES.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#f4f2fd] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans antialiased">
      {/* Container Principal Estilo Modal Centralizado */}
      <div className="w-full max-w-[760px] bg-white rounded-3xl border border-[#e8e7f1] shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        
        {/* Cabeçalho do Card */}
        <div className="p-6 sm:p-8 md:p-10 pb-4">
          <div className="flex items-center justify-between mb-8">
            {/* Logo InRumo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#7e5700] rounded-lg flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-heading text-lg font-bold text-[#1a1b22] tracking-tight">
                InRumo
              </span>
            </div>

            {/* Progresso de Passos */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-[#eeedf7]" />
              <div className="w-6 h-1.5 rounded-full bg-[#eeedf7]" />
              <div className="w-6 h-1.5 rounded-full bg-[#7e5700]" />
            </div>
          </div>

          {/* Título & Descrição */}
          <div className="space-y-2 mb-6">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
              Qual é o teu curso atual ou pretendido?
            </h1>
            <p className="font-body text-sm sm:text-base text-[#504536] max-w-2xl leading-relaxed">
              Seleciona o teu curso no INSTIC. Esta informação ajudará a personalizar a tua experiência e recomendações de carreira.
            </p>
          </div>

          {/* Campo de Pesquisa */}
          <div className="relative flex items-center mb-6">
            <Search className="absolute left-4 w-4 h-4 text-[#827564] pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar cursos (ex: Engenharia, Gestão)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f4f2fd]/60 focus:bg-white text-sm text-[#1a1b22] placeholder-[#827564]/80 pl-11 pr-4 py-3.5 rounded-2xl border border-transparent focus:border-[#7e5700] focus:outline-none transition-all"
            />
          </div>

          {/* Grelha de Cursos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredCourses.map((course) => {
              const Icon = course.icon;
              const isSelected = selectedCourseId === course.id;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#fbf5e8] border-[#7e5700] shadow-2xs'
                      : 'bg-white border-[#e8e7f1] hover:border-[#d4c4b0] hover:bg-[#fbf8ff]'
                  }`}
                >
                  {/* Ícone da Categoria */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#7e5700] text-white'
                        : 'bg-[#f4f2fd] text-[#504536]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Informações do Curso */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-heading text-sm font-bold text-[#1a1b22] leading-snug truncate">
                      {course.title}
                    </h3>
                    <p className="font-body text-xs text-[#827564] mt-0.5 truncate">
                      {course.category}
                    </p>
                  </div>

                  {/* Indicador de Seleção (Radio / Check) */}
                  <div className="absolute top-4 right-4">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#7e5700] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#d4c4b0] bg-transparent" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="bg-[#f4f2fd]/60 border-t border-[#e8e7f1] p-4 sm:px-8 sm:py-5 flex items-center justify-between mt-auto">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-semibold text-[#504536] hover:text-[#1a1b22] transition-colors py-2 px-3 rounded-xl hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <button
            type="button"
            className="bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-sm font-semibold py-3 px-6 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-2"
          >
            Finalizar Configuração
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
}