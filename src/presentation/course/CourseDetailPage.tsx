import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../application/auth/useAuth";
import { useMemo } from "react";
import { SupabaseCourseRepository } from "../../data/supabase/SupabaseCourseRepository";
import { useCourse } from "../../application/course/useCourse";
import type { CourseId } from "../../domain/test/TestQuestion";
import NotFoundPage from "../../components/NotFoundPage";
import { CourseBasicInfo } from "./CourseBasicInfo";
import { CourseDeepBenefits } from "./CourseDeepBenefits";
import { LockedBenefitsTeaser } from "./LockedBenefitsTeaser";
import { useTestResult } from "../../application/test/useTestResult";
import { SupabaseTestRepository } from "../../data/supabase/SupabaseTestRepository";
import { NotRecommendedNotice } from "./NotRecommendedNotice";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: CourseId }>();
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const courseRepository = useMemo(() => new SupabaseCourseRepository(), []);
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const { course, loading } = useCourse(id, courseRepository);
  const { result, loading: resultLoading } = useTestResult(testRepository);

  if (loading || resultLoading) {
    return (
      <div className="max-w-container-max mx-auto w-full space-y-8 animate-fadeIn">
        {/* Skeleton do Header / Título */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-2.5 flex-1">
              <div className="h-4 w-32 bg-surface-container-high rounded-full animate-pulse" />
              <div className="h-7 w-2/3 sm:w-1/2 bg-surface-container-high rounded-2xl animate-pulse" />
              <div className="h-3.5 w-5/6 sm:w-1/3 bg-surface-container-high rounded-xl animate-pulse" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high animate-pulse shrink-0 hidden sm:block" />
          </div>
        </div>

        {/* Grid de Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 space-y-5 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-surface-container-high animate-pulse" />
                  <div className="h-5 w-20 bg-surface-container-high rounded-full animate-pulse" />
                </div>
                <div className="h-6 w-3/4 bg-surface-container-high rounded-xl animate-pulse" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-full bg-surface-container-high rounded-lg animate-pulse" />
                  <div className="h-3.5 w-4/5 bg-surface-container-high rounded-lg animate-pulse" />
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                <div className="h-4 w-24 bg-surface-container-high rounded-lg animate-pulse" />
                <div className="h-8 w-28 bg-surface-container-high rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Indicador Centralizado de Carregamento */}
        <div className="flex flex-col items-center justify-center py-6 gap-3 text-on-surface-variant">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wide">A carregar informações do teste...</p>
        </div>
      </div>
    );
  }

  if (!course) return <NotFoundPage />;

  const isMatriculado = profile?.situacao === 'matriculado';
  const isRecommended = result?.recommendedCourseId === id;
  const canSeeFullCourse = isMatriculado || isRecommended;

  return (
    <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg py-10">
      <CourseBasicInfo course={course} locked={!canSeeFullCourse} />
      {!session ? (
        <LockedBenefitsTeaser onRegister={() => navigate('/register')} />
      ) : canSeeFullCourse ? (
        <CourseDeepBenefits courseId={course.id} />
      ) : (
        <NotRecommendedNotice recommendedCourseId={result?.recommendedCourseId} />
      )}
    </div>
  );
}