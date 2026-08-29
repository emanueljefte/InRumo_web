import React, { useState } from 'react';
import { Search, Bell, ChevronRight, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

const CATEGORIES = [
  'Todos',
  'Engenharia e Tecnologia',
  'Ciências Empresariais',
  'Artes e Design',
  'Ciências Sociais',
];

const COURSES: Course[] = [
  {
    id: 'eng-info',
    title: 'Engenharia Informática',
    category: 'Engenharia e Tecnologia',
    description:
      'Desenvolvimento de software, redes e sistemas de informação. Foco em inovação tecnológica e resolução de problemas complexos.',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'gest-ind',
    title: 'Gestão Industrial',
    category: 'Ciências Empresariais',
    description:
      'Otimização de processos produtivos, logística e gestão de operações. Preparação para liderança em ambientes industriais modernos.',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'des-com',
    title: 'Design de Comunicação',
    category: 'Artes e Design',
    description:
      'Criação de identidades visuais, interfaces digitais e comunicação multimédia. Abordagem prática centrada no utilizador.',
    imageUrl:
      'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'eco-fin',
    title: 'Economia e Finanças',
    category: 'Ciências Empresariais',
    description:
      'Análise de mercados, gestão de investimentos e planeamento estratégico financeiro. Formação analítica rigorosa.',
    imageUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
  },
];

export default function CoursesCatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory =
      activeCategory === 'Todos' || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      {/* BARRA SUPERIOR DE PESQUISA & NOTIFICAÇÕES */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827564]" />
          <input
            type="text"
            placeholder="Pesquisar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#eeedf7]/50 focus:bg-white border border-transparent focus:border-[#7e5700] text-xs text-[#1a1b22] placeholder:text-[#827564]/70 pl-11 pr-4 py-3 rounded-full outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
            aria-label="Notificações"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            alt="Perfil do utilizador"
            className="w-9 h-9 rounded-full object-cover border border-[#e8e7f1]"
          />
        </div>
      </div>

      {/* CABEÇALHO DA PÁGINA */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Catálogo de Cursos
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Explore as opções académicas disponíveis no INSTIC e encontre o seu caminho profissional.
        </p>
      </div>

      {/* FILTROS POR CATEGORIA (PILLS) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#7e5700] text-white shadow-2xs'
                  : 'bg-[#f4f2fd] text-[#504536] hover:bg-[#eeedf7] border border-[#e8e7f1]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* GRELHA DE CARTÕES DE CURSO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl border border-[#e8e7f1] overflow-hidden shadow-2xs hover:border-[#d4c4b0] transition-all flex flex-col justify-between group"
          >
            {/* Imagem do Curso com Badge */}
            <div className="relative h-48 w-full overflow-hidden bg-[#f4f2fd]">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-[#fbf5e8]/90 backdrop-blur-xs text-[#7e5700] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#d4c4b0]/40">
                {course.category}
              </span>
            </div>

            {/* Conteúdo Informativo */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors">
                  {course.title}
                </h3>
                <p className="font-body text-xs text-[#827564] leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Botão Ver Detalhes */}
              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7e5700] hover:text-[#604100] transition-colors cursor-pointer"
                >
                  <span>Ver Detalhes</span>
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}