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

  if (loading || resultLoading) return null;
  if (!course) return <NotFoundPage />;

  const isMatriculado = profile?.situacao === 'matriculado';
  const isRecommended = result?.recommendedCourseId === id;
  const canSeeFullCourse =  isMatriculado || isRecommended;

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