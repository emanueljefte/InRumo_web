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

export default function CourseDetailPage() {
  const { id } = useParams<{ id: CourseId }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  const courseRepository = useMemo(() => new SupabaseCourseRepository(), []);
  const { course, loading } = useCourse(id, courseRepository);

  if (loading) return null;
  if (!course) return <NotFoundPage />;
  return (
    <div>
      {/* conteúdo público: nome, descrição, grade básica */}
      <CourseBasicInfo course={course} />

      {session ? (
        <CourseDeepBenefits courseId={course.id} /> // outcomes, testemunho, first-year glimpse
      ) : (
        <LockedBenefitsTeaser onRegister={() => navigate('/register')} /> // "Regista-te para veres mais"
      )}
    </div>
  );
}