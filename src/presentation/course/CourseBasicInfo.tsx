import { useState, useMemo, useId } from 'react';
import {
  ChevronDown,
  BookOpen,
  Sparkles,
  Search,
  GraduationCap,
  Calendar,
  Layers,
  Clock,
  X
} from 'lucide-react';
import type { Course } from '../../domain/course/Course';

export function CourseBasicInfo({ course, locked }: { course: Course; locked?: boolean }) {
  const [openYear, setOpenYear] = useState<string | null>(
    course.curriculum?.[0]?.ano ?? null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const baseId = useId();

  // Métrica 1: Total de Anos
  const totalAnos = course.curriculum?.length ?? 0;

  // Métrica 2: Total de Semestres
  const totalSemestres = useMemo(() => {
    return course.curriculum?.reduce((acc, y) => acc + y.semestres.length, 0) ?? 0;
  }, [course.curriculum]);

  // Métrica 3: Total de Disciplinas
  const totalDisciplinas = useMemo(() => {
    return course.curriculum?.reduce(
      (acc, y) => acc + y.semestres.reduce((s, sem) => s + sem.disciplinas.length, 0),
      0
    ) ?? 0;
  }, [course.curriculum]);

  // Filtro de Busca Inteligente
  const filteredCurriculum = useMemo(() => {
    if (!searchTerm.trim()) return course.curriculum ?? [];

    const term = searchTerm.toLowerCase();
    return (course.curriculum ?? [])
      .map((year) => {
        const matchingSemestres = year.semestres
          .map((sem) => ({
            ...sem,
            disciplinas: sem.disciplinas.filter((d) => d.toLowerCase().includes(term)),
          }))
          .filter((sem) => sem.disciplinas.length > 0);

        return {
          ...year,
          semestres: matchingSemestres,
        };
      })
      .filter((year) => year.semestres.length > 0);
  }, [course.curriculum, searchTerm]);

  // Expandir automaticamente se houver busca ativa
  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="max-w-5xl space-y-8 font-body text-on-surface antialiased">

      {/* 1. HERO & METADADOS */}
      <header className="relative overflow-hidden rounded-3xl bg-linear-to-br from-surface-container-lowest via-surface-container-low to-surface-container-lowest p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">

        {/* Elemento Decorativo Subtil */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={13} className="shrink-0" />
              <span>Grade Curricular Oficial</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 text-on-surface-variant text-xs font-medium">
              <GraduationCap size={13} className="shrink-0" />
              <span>Nível Superior</span>
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
            {course.name}
          </h1>

          {course.description && (
            <p className="text-sm sm:text-base text-on-surface-variant/90 leading-relaxed max-w-3xl">
              {course.description}
            </p>
          )}
        </div>

        {/* Dash/Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Duração</p>
              <p className="text-sm font-bold text-on-surface">{totalAnos} Anos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Etapas</p>
              <p className="text-sm font-bold text-on-surface">{totalSemestres} Semestres</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Matérias</p>
              <p className="text-sm font-bold text-on-surface">{totalDisciplinas} Disciplinas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Formato</p>
              <p className="text-sm font-bold text-on-surface">Presencial / Híbrido</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BARRA DE FERRAMENTAS & PESQUISA */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-on-surface">
              Estrutura Pedagógica
            </h2>
            <p className="text-xs text-on-surface-variant">
              Explore o plano de estudos distribuído por anos e períodos
            </p>
          </div>

          {/* Campo de Pesquisa em Tempo Real */}
          <div className="relative min-w-65">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar disciplina..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Estado Vazio de Busca */}
        {filteredCurriculum.length === 0 && (
          <div className="p-10 text-center rounded-3xl bg-surface-container-low/30 border border-dashed border-outline-variant/40 space-y-2">
            <p className="text-sm font-semibold text-on-surface">Nenhuma disciplina encontrada</p>
            <p className="text-xs text-on-surface-variant">
              Não encontramos resultados para "{searchTerm}". Tente pesquisar por outro termo.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Limpar busca
            </button>
          </div>
        )}

        {!locked && (
          <div>
            <h2 className="font-heading text-headline-sm text-on-surface mb-3">Grade curricular</h2>
            {/* 3. LINHA DO TEMPO DA GRADE (STEPPER ACCORDION) */}
            <div className="relative space-y-4 pt-2">

              {/* Linha Vertical Conectora */}
              <div className="absolute left-5.75 top-6 bottom-6 w-0.5 bg-outline-variant/20 hidden sm:block pointer-events-none" />

              {filteredCurriculum.map((year, index) => {
                const isOpen = isSearching || openYear === year.ano;
                const totalDisciplinasAno = year.semestres.reduce(
                  (sum, s) => sum + s.disciplinas.length,
                  0
                );
                const headerId = `${baseId}-header-${index}`;
                const contentId = `${baseId}-content-${index}`;
                const yearIndexFormatted = String(index + 1).padStart(2, '0');

                return (
                  <div
                    key={year.ano}
                    className={`group relative transition-all duration-300 rounded-2xl sm:rounded-3xl ${isOpen
                        ? 'bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/30'
                        : 'bg-surface-container-low/40 hover:bg-surface-container-low'
                      }`}
                  >
                    {/* Cabeçalho do Ano */}
                    <button
                      type="button"
                      id={headerId}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      onClick={() => setOpenYear(isOpen && !isSearching ? null : year.ano)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl sm:rounded-3xl"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">

                        {/* Badge Numérico Estilo Stepper */}
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${isOpen
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary'
                            }`}
                        >
                          {yearIndexFormatted}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-base sm:text-lg text-on-surface truncate">
                              {year.ano}
                            </h3>
                            {year.etapa && (
                              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-container-high text-on-surface-variant">
                                {year.etapa}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant/80">
                            {totalDisciplinasAno} disciplinas programadas
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div
                          className={`p-2 rounded-xl transition-all duration-200 ${isOpen
                              ? 'bg-primary/10 text-primary rotate-180'
                              : 'text-on-surface-variant group-hover:bg-surface-container-high'
                            }`}
                        >
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </button>

                    {/* Conteúdo Expansível do Ano */}
                    {isOpen && (
                      <div
                        id={contentId}
                        role="region"
                        aria-labelledby={headerId}
                        className="px-4 sm:px-6 pb-6 pt-2 space-y-6 animate-in fade-in duration-200"
                      >
                        {year.semestres.map((sem) => (
                          <div key={sem.semestre} className="space-y-3">

                            {/* Semestre Header Pill */}
                            <div className="flex items-center gap-2.5 pt-2">
                              <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold tracking-wider uppercase">
                                {sem.semestre}
                              </span>
                              <span className="text-xs text-on-surface-variant font-medium">
                                • {sem.disciplinas.length} {sem.disciplinas.length === 1 ? 'matéria' : 'matérias'}
                              </span>
                              <div className="h-px flex-1 bg-outline-variant/20" />
                            </div>

                            {/* Grid de Micro-Cards das Disciplinas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {sem.disciplinas.map((d) => (
                                <div
                                  key={d}
                                  className="group/card relative flex items-center justify-between p-3.5 rounded-xl sm:rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 hover:shadow-xs transition-all duration-200 cursor-default"
                                >
                                  <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover/card:bg-primary group-hover/card:scale-125 transition-all shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium text-on-surface/90 group-hover/card:text-on-surface leading-snug line-clamp-2">
                                      {d}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}