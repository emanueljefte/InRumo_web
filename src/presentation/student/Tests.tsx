import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FilterX,
  HelpCircle,
  PlayCircle,
  Search,
} from 'lucide-react';
import { useTestsList, type QuizStatus } from '../../features/tests/useTestsList';

const FILTERS: { key: 'all' | QuizStatus; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'not_started', label: 'Não iniciados' },
  { key: 'in_progress', label: 'Em progresso' },
  { key: 'completed', label: 'Concluídos' },
];

export default function TestsPage() {
  const { quizzes, loading } = useTestsList();
  const [filter, setFilter] = useState<'all' | QuizStatus>('all');
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtragem combinada (Por filtro de status e por termo de busca)
  const filtered = quizzes.filter((q) => {
    const matchesStatus = filter === 'all' || q.status === filter;
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    if (!loading && listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, filter, searchTerm]);

  // Badge de Status com os tons exatos do InRumo
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#15803d]/10 text-[#15803d] border border-[#15803d]/20">
            <CheckCircle2 size={12} />
            Concluído
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fbf5e8] text-[#7e5700] border border-[#d4c4b0]/50">
            <PlayCircle size={12} />
            Em andamento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f4f2fd] text-[#827564] border border-[#e8e7f1]">
            <Circle size={12} />
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-4 sm:px-6 font-sans text-[#1a1b22] antialiased space-y-8">
      
      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Testes Vocacionais
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Explora e responde aos questionários para mapear o teu perfil profissional e vocacional.
        </p>
      </div>

      {/* Controlos: Busca + Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        
        {/* Chips de Filtro */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#7e5700] text-white shadow-xs'
                    : 'bg-white text-[#504536] border border-[#e8e7f1] hover:border-[#d4c4b0] hover:text-[#1a1b22]'
                }`}
              >
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input de Pesquisa */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827564]" />
          <input
            type="text"
            placeholder="Pesquisar teste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#e8e7f1] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1a1b22] placeholder:text-[#827564]/70 focus:outline-none focus:border-[#7e5700] transition-colors"
          />
        </div>
      </div>

      {/* Estados da Lista */}
      {loading ? (
        /* Skeleton Otimizado */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e7f1] rounded-2xl p-6 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-[#eeedf7] rounded-md w-1/4" />
                <div className="h-5 bg-[#eeedf7] rounded-full w-1/5" />
              </div>
              <div className="h-5 bg-[#eeedf7] rounded-md w-3/4" />
              <div className="h-4 bg-[#eeedf7] rounded-md w-1/2 pt-4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-[#e8e7f1] rounded-3xl shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#f4f2fd] flex items-center justify-center text-[#7e5700] mb-3">
            <FilterX size={24} />
          </div>
          <h3 className="font-heading text-base font-bold text-[#1a1b22] mb-1">
            Nenhum teste encontrado
          </h3>
          <p className="font-body text-xs text-[#504536] max-w-xs mb-4">
            Não foram encontrados testes com o filtro selecionado ou com o termo pesquisado.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setSearchTerm('');
            }}
            className="text-xs font-bold text-[#7e5700] hover:underline cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        </div>
      ) : (
        /* Grid de Cards de Teste */
        <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quiz) => (
            <button
              key={quiz.id}
              type="button"
              onClick={() => navigate(`/quiz/${quiz.id}/run`)}
              className="group text-left bg-white border border-[#e8e7f1] hover:border-[#7e5700] rounded-2xl p-6 hover:shadow-2xs transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                {/* Header do Card: Tag/Público & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e5700] bg-[#fbf5e8] px-2.5 py-1 rounded-md border border-[#d4c4b0]/40">
                    {quiz.targetTypeLabel}
                  </span>
                  {renderStatusBadge(quiz.status)}
                </div>

                {/* Título */}
                <h3 className="font-heading text-base font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors line-clamp-2">
                  {quiz.title}
                </h3>
              </div>

              {/* Seção Inferior: Meta Info ou Barra de Progresso */}
              <div className="mt-6 pt-4 border-t border-[#e8e7f1]/60">
                {quiz.status === 'in_progress' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#827564] font-medium">
                      <span>Progresso</span>
                      <span className="text-[#7e5700] font-bold">{quiz.progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-[#eeedf7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c9932e] rounded-full transition-all duration-300"
                        style={{ width: `${quiz.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#827564]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <HelpCircle size={14} className="text-[#7e5700]" />
                        {quiz.questionCount} perguntas
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-[#827564] group-hover:text-[#7e5700] group-hover:translate-x-0.5 transition-all" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}