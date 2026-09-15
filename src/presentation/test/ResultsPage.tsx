import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateTestResult, isTie, type TestResult } from '../../application/test/calculateTestResult';
import { COURSE_LABELS } from '../../domain/course/courseLabels';
import {  CheckCircle2, RotateCcw, Scale, Sparkles, TrendingUp } from 'lucide-react';
import type { CourseId } from '../../domain/test/TestQuestion';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { associateAnonymousResult } from '../../application/test/associateAnonymousResult';

export interface CourseScore {
  courseId: string;
  percentage: number;
}

function readTestResult(): TestResult | null {
  const raw = sessionStorage.getItem('vocational_test_answers');
  if (!raw) return null;
  return calculateTestResult(JSON.parse(raw));
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const [result] = useState<TestResult | null>(() => readTestResult());
  const [associatingResult, setAssociatingResult] = useState<'idle' | 'done'>('idle');

  const primaryCourseName = COURSE_LABELS[result!.recommended.courseId] || result?.recommended.courseId;
  const runnerUpName = result?.runnerUp ? COURSE_LABELS[result.runnerUp.courseId] : '';
  const topPercentage = Math.round(result!.recommended.percentage);

  useEffect(() => {
    if (!result) {
      navigate('/test', { replace: true });
      return;
    }

    sessionStorage.setItem(
      'vocational_test_result',
      JSON.stringify({
        recommendedCourseId: result.recommended.courseId,
        isTie: isTie(result),
        runnerUpCourseId: isTie(result) ? result.runnerUp.courseId : null,
        allScores: result.allScores.map((s) => ({ courseId: s.courseId, percentage: s.percentage })),
      })
    );

    if (session && associatingResult === 'idle') {
    associateAnonymousResult(session.user.id, testRepository).finally(() => setAssociatingResult('done'));
  }
  }, [result, navigate, session, testRepository, associatingResult]);

  const associating = Boolean(session) && associatingResult === 'idle';
  if (!result) return null;

  const tied = isTie(result);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-10 font-body antialiased text-on-surface selection:bg-primary-container selection:text-on-primary-container">

      {/* Container Principal */}
      <div className="max-w-xl w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 md:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden my-auto">

        {/* Glow de Fundo Decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* --- CASO 1: EMPATE / RESULTADO EQUILIBRADO --- */}
        {tied ? (
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/40 text-on-tertiary-container border border-tertiary/20 text-xs font-semibold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-tertiary" />
              <span>Resultado Equilibrado</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
              {primaryCourseName} <span className="text-tertiary font-normal">&</span> {runnerUpName}
            </h1>

            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-md mx-auto">
              Seu perfil demonstrou aptidão equivalente para dois cursos ({topPercentage}% e {Math.round(result.runnerUp.percentage)}%). Fale com nosso Orientador IA para desempate analítico.
            </p>

            {/* Grid dos Cursos Empatados */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Opção A</span>
                <p className="text-xs font-bold text-on-surface truncate">{primaryCourseName}</p>
                <p className="text-sm font-extrabold text-primary">{topPercentage}% afinidade</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-1">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Opção B</span>
                <p className="text-xs font-bold text-on-surface truncate">{runnerUpName}</p>
                <p className="text-sm font-extrabold text-tertiary">{Math.round(result.runnerUp.percentage)}% afinidade</p>
              </div>
            </div>
          </div>
        ) : (

          /* --- CASO 2: RESULTADO DIRETO / RECOMENDAÇÃO ÚNICA --- */
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Melhor Correspondência Vocacional</span>
            </div>

            {/* Destaque Visual em Círculo / Percentage Badge */}
            <div className="pt-2 flex flex-col items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-primary/20 via-primary-container to-surface-container flex flex-col items-center justify-center border-4 border-background shadow-inner relative mb-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading text-primary leading-none">
                  {topPercentage}%
                </span>
                <span className="text-[10px] font-medium text-on-surface-variant mt-0.5">Afinidade</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
                {primaryCourseName}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
              Seu perfil cognitivo e de interesses apresenta alto alinhamento com a grade curricular deste curso no INSTIC.
            </p>
          </div>
        )}

        {/* --- DETALHAMENTO DE TODAS AS AFINIDADES (BREAKDOWN) --- */}
        <div className="pt-6 border-t border-outline-variant/40 space-y-3 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
            <span>Compatibilidade por Curso</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {result.allScores.map((score: CourseScore) => {
              const isTop = score.courseId === result.recommended.courseId;
              const courseLabel = COURSE_LABELS[score.courseId as CourseId] ?? score.courseId;
              const pct = Math.round(score.percentage);

              return (
                <div
                  key={score.courseId}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 ${isTop
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-surface-container-low/50 border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isTop ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm truncate ${isTop ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                      {courseLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-36 shrink-0 justify-end">
                    <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isTop ? 'bg-primary' : 'bg-text-muted'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono w-9 text-right ${isTop ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- BOTÕES DE AÇÃO / CONVERSÃO --- */}
         <div className="pt-4 space-y-3">
          {session ? (
            <button onClick={() => navigate('/candidate')} disabled={associating}
              className="w-full bg-primary-container text-on-primary-container font-semibold px-6 py-3 rounded-xl disabled:opacity-50">
              {associating ? 'A guardar...' : 'Ver no painel'}
            </button>
          ) : (
            <button onClick={() =>
              navigate('/register/candidate', {
                state: { recommendedCourse: result.recommended.courseId }
              })
            } className="w-full bg-primary text-on-primary font-semibold px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2.5 group active:scale-[0.98] cursor-pointer">
              {tied ? 'Criar conta e falar com o Orientador IA' : 'Criar conta e ver curso completo'}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/landingpage')}
            className="w-full font-medium text-xs sm:text-sm text-on-surface-variant hover:text-on-surface border border-outline-variant/80 hover:bg-surface-container py-3 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </button>
        </div>

      </div>
    </div>
  );
}