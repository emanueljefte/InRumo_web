import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw,
  Compass
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { COURSE_LABELS } from '../../domain/course/courseLabels';
import type { CourseId } from '../../domain/test/TestQuestion';
import { useEffect, useMemo, useState } from 'react';
import { isTie, type TestResult } from '../../application/test/calculateTestResult';
import { associateAnonymousResult } from '../../application/test/associateAnonymousResult';
import { useTestResult } from '../../application/test/useTestResult';

export default function CandidateResultsPage() {
  const navigate = useNavigate();
  const { profile, session } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const {  loading } = useTestResult(testRepository);
  const [result] = useState<TestResult | null>(() => readTestResult());
  const [associating, setAssociating] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate('/test', { replace: true });
      return;
    }

    sessionStorage.setItem('vocational_test_result', JSON.stringify({
      recommendedCourseId: result.recommended.courseId,
      isTie: isTie(result),
      runnerUpCourseId: isTie(result) ? result.runnerUp.courseId : null,
      allScores: result.allScores.map((s) => ({ courseId: s.courseId, percentage: s.percentage })),
    }));

    // já autenticado — associa o resultado directamente, sem esperar por registo
    if (session) {
      setAssociating(true);
      associateAnonymousResult(session.user.id, testRepository).finally(() => setAssociating(false));
    }
  }, [result, session, navigate, testRepository]);

  if (!result) return null;
  const tied = isTie(result);

  // Skeleton Loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-4">
        <div className="h-28 bg-surface-container/60 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 h-96 bg-surface-container/60 rounded-3xl" />
          <div className="md:col-span-5 h-96 bg-surface-container/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Ecrã de Teste Não Realizado
  if (!result || !result.recommendedCourseId) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-6 space-y-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-on-surface">
            Ainda não descobriste o teu perfil
          </h2>
          <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
            {profile?.nome ? `${profile.nome}, realiza` : 'Realiza'} o teste de aptidões para identificarmos os cursos do INSTIC que melhor se alinham com os teus objetivos.
          </p>
        </div>
        <button
          onClick={() => navigate('/candidate/test')}
          className="bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm px-8 py-3.5 rounded-2xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
        >
          <span>Começar Teste Vocacional</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const primaryCourseName = COURSE_LABELS[result.recommendedCourseId as CourseId] ?? 'Curso Recomendado';
  const runnerUpCourseName = result.runnerUpCourseId ? COURSE_LABELS[result.runnerUpCourseId as CourseId] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body antialiased pb-12">
      
      {/* Banner Principal de Destaque */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#1a1b22] via-[#242530] to-[#1a1b22] text-white p-8 md:p-10 rounded-3xl shadow-md border border-white/10">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-container text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Perfil Analisado com Sucesso</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1">
              Curso Ideal Recomendado
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">
              {result.isTie && runnerUpCourseName ? `${primaryCourseName} & ${runnerUpCourseName}` : primaryCourseName}
            </h1>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            {result.isTie 
              ? 'A tua pontuação demonstra uma forte dupla afinidade técnica. Ambos os cursos oferecem um excelente alinhamento com o teu perfil.'
              : 'Com base nas tuas respostas e preferências de aptidão, este é o curso com maior afinidade para o teu futuro no INSTIC.'}
          </p>
        </div>

        <Award className="absolute -bottom-6 -right-6 w-56 h-56 text-white/5 pointer-events-none" />
      </div>

      {/* Grid de Detalhes e Ações */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Gráfico de Aptidões (7 Cols) */}
        <div className="md:col-span-7 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="font-heading text-lg font-bold text-on-surface">
              Distribuição de Compatibilidade
            </h2>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Percentagem de alinhamento com cada área académica.
            </p>
          </div>

          <div className="space-y-4">
            {result.allScores
              .filter((score) => Boolean(score.courseId))
              .map((score) => {
                const courseName = COURSE_LABELS[score.courseId as CourseId] ?? 'Curso';
                const percentage = Math.round(score.percentage);
                const isRecommended = score.courseId === result.recommendedCourseId || score.courseId === result.runnerUpCourseId;

                return (
                  <div key={score.courseId} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${isRecommended ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {courseName}
                      </span>
                      <span className="font-bold text-on-surface">
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-3 bg-surface-container rounded-full overflow-hidden p-0.5 border border-outline-variant/20">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isRecommended 
                            ? 'bg-primary' 
                            : 'bg-outline-variant'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-on-surface-variant border-t border-outline-variant/30">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Resultado gravado na conta
            </span>
            <button
              onClick={() => navigate('/candidate/test')}
              className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refazer Teste
            </button>
          </div>
        </div>

        {/* Próximos Passos (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="font-heading font-bold text-base text-on-surface">
              Ações Recomendadas
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/course/${result.recommendedCourseId}`)}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs py-3.5 px-4 rounded-2xl transition-all shadow-xs cursor-pointer flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Ver Plano do Curso
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/candidate/chat')}
                className="w-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface font-semibold text-xs py-3.5 px-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Tirar Dúvidas com Orientador
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-primary/5 border border-primary/15 space-y-2">
            <h4 className="font-heading font-bold text-xs text-primary uppercase tracking-wider">
              Próxima Etapa: Inscrição
            </h4>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Com o teu relatório pronto, podes dirigir-te à secretaria ou continuar o processo de pré-matrícula online.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}