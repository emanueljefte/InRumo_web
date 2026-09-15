import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Sparkles,
  Bot,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { useTestResult } from '../../application/test/useTestResult';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { COURSE_LABELS } from '../../domain/course/courseLabels';

export default function CandidateResults() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const { result, loading } = useTestResult(testRepository);

  const isReady = !loading && result !== undefined;

  // ================= 1. STATE: SKELETON LOADING =================
  if (!isReady) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-6 px-4">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-4 w-28 bg-surface-container-high rounded-full animate-pulse" />
            <div className="h-8 w-3/4 sm:w-1/2 bg-surface-container-high rounded-2xl animate-pulse" />
            <div className="h-4 w-1/3 bg-surface-container-high rounded-lg animate-pulse" />
          </div>

          <div className="space-y-4 pt-6 border-t border-outline-variant/30">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="h-4 w-40 bg-surface-container-high rounded-md animate-pulse" />
                <div className="h-3.5 w-32 bg-surface-container-high rounded-full animate-pulse" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <div className="h-12 w-full bg-surface-container-high rounded-2xl animate-pulse" />
            <div className="h-12 w-full bg-surface-container-high rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. STATE: SEM TESTE REALIZADO =================
  if (!result || !result.recommendedCourseId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-on-surface">
              Sem resultados disponíveis
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Ainda não fizeste o teste vocacional,{' '}
              <span className="font-semibold text-on-surface">
                {profile?.nome ?? 'candidato'}
              </span>
              . Descobre qual dos cursos do INSTIC combina melhor com o teu perfil!
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/candidate/test')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl hover:opacity-95 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Fazer Teste Vocacional</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 3. STATE: RESULTADO DISPONÍVEL =================
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4 animate-fadeIn">
      {/* Card Principal do Resultado */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 sm:p-8 space-y-8 shadow-xs relative overflow-hidden">
        
        {/* Banner de Fundo Decorativo */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

        {/* Topo / Header do Resultado */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
            <Award size={14} />
            <span>Perfil Vocacional</span>
          </div>

          {result.isTie ? (
            <div className="space-y-1">
              <span className="text-xs text-on-surface-variant font-medium">Empate Técnico recomendado:</span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                {COURSE_LABELS[result.recommendedCourseId]}
                {result.runnerUpCourseId && (
                  <span className="text-primary font-semibold"> & {COURSE_LABELS[result.runnerUpCourseId]}</span>
                )}
              </h1>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-xs text-on-surface-variant font-medium">Curso com Maior Afinidade:</span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                {COURSE_LABELS[result.recommendedCourseId]}
              </h1>
            </div>
          )}
        </div>

        {/* Distribuição de Afinidade por Curso */}
        <div className="pt-6 border-t border-outline-variant/30 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Afinidade por Área
            </h3>
            <span className="text-[11px] text-on-surface-variant font-medium">
              Compatibilidade %
            </span>
          </div>

          <div className="space-y-3.5">
            {result.allScores.map(
              (score) =>
                score.courseId && (
                  <div key={score.courseId} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="font-semibold text-on-surface">
                        {COURSE_LABELS[score.courseId]}
                      </span>
                      <span className="font-bold text-primary">
                        {Math.round(score.percentage)}%
                      </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(score.percentage, 4)}%` }}
                      />
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Botões de Ação Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => navigate(`/course/${result.recommendedCourseId}`)}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl hover:opacity-95 shadow-xs transition-all cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Ver curso recomendado</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/candidate/chat')}
            className="w-full inline-flex items-center justify-center gap-2 border border-outline-variant/60 text-on-surface font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <Bot size={16} className="text-primary" />
            <span>Falar com Orientador IA</span>
          </button>
        </div>

        {/* Refazer Teste */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate('/candidate/test')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Refazer o teste vocacional</span>
          </button>
        </div>

      </div>
    </div>
  );
}