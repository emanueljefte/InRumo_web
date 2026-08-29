import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateTestResult, isTie, type TestResult } from '../../application/test/calculateTestResult';
import { COURSE_LABELS } from '../../domain/course/courseLabels';

function readTestResult(): TestResult | null {
  const raw = sessionStorage.getItem('vocational_test_answers');
  if (!raw) return null;
  return calculateTestResult(JSON.parse(raw));
}

export default function ResultsPage() {
    const navigate = useNavigate();
    const [result] = useState<TestResult | null>(() => readTestResult()); 

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
  }, [result, navigate]);

  if (!result) return null;

  const tied = isTie(result);

    if (!result) return null;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-surface-container-lowest rounded-3xl border border-surface-container-high p-8 space-y-6 text-center">
                {tied ? (
                    <>
                        <span className="font-body-sm text-xs font-semibold text-tertiary uppercase tracking-widest">
                            Resultado equilibrado
                        </span>
                        <h1 className="font-heading text-headline-md text-on-surface">
                            {COURSE_LABELS[result.recommended.courseId]} e {COURSE_LABELS[result.runnerUp.courseId]}
                        </h1>
                        <p className="font-body-md text-on-surface-variant">
                            O teu perfil combina bem com dois cursos ({Math.round(result.recommended.percentage)}% e{' '}
                            {Math.round(result.runnerUp.percentage)}%). Regista-te para uma análise mais aprofundada com o nosso Orientador IA.
                        </p>
                    </>
                ) : (
                    <>
                        <span className="font-body-sm text-xs font-semibold text-primary uppercase tracking-widest">
                            O teu resultado
                        </span>
                        <h1 className="font-heading text-headline-lg text-on-surface">
                            {COURSE_LABELS[result.recommended.courseId]}
                        </h1>
                        <p className="font-body-md text-on-surface-variant">
                            {Math.round(result.recommended.percentage)}% de afinidade com este curso
                        </p>
                    </>
                )}

                <div className="pt-4 border-t border-surface-container-high space-y-2 text-left">
                    {result.allScores.map((score) => (
                        <div key={score.courseId} className="flex justify-between items-center gap-3">
                            <span className="font-body-sm text-on-surface-variant">{COURSE_LABELS[score.courseId]}</span>
                            <div className="flex items-center gap-2 w-32">
                                <div className="flex-1 bg-surface-container h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${score.percentage}%` }} />
                                </div>
                                <span className="font-body-sm text-xs text-on-surface-variant w-9 text-right">
                                    {Math.round(score.percentage)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 space-y-3">
                    <button
                        onClick={() => navigate('/register', { state: { recommendedCourse: result.recommended.courseId } })}
                        className="w-full bg-primary-container text-on-primary-container font-semibold px-6 py-3 rounded-xl"
                    >
                        {tied ? 'Criar conta e falar com o Orientador IA' : 'Criar conta e ver curso completo'}
                    </button>
                    <button onClick={() => navigate('/landingpage')} className="w-full font-medium px-6 py-3 rounded-xl border">
                        Voltar ao início
                    </button>
                </div>
            </div>
        </div>
    );
}