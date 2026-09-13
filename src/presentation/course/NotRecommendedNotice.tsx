import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { COURSE_LABELS } from '../../domain/course/courseLabels';
import type { CourseId } from '../../domain/test/TestQuestion';

export function NotRecommendedNotice({ recommendedCourseId }: { recommendedCourseId?: CourseId }) {
  const navigate = useNavigate();

  return (
    <div className="mt-10 pt-8 border-t border-outline-variant/50">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center space-y-3">
        <Lock className="w-6 h-6 text-primary mx-auto" />
        <h3 className="font-heading text-headline-sm text-on-surface">Grade curricular não disponível</h3>
        <p className="font-body-sm text-on-surface-variant max-w-sm mx-auto">
          Este conteúdo detalhado está reservado ao curso que te foi recomendado.
        </p>
        {recommendedCourseId && (
          <button onClick={() => navigate(`/course/${recommendedCourseId}`)} className="text-primary text-sm font-semibold">
            Ver {COURSE_LABELS[recommendedCourseId]}
          </button>
        )}
      </div>
    </div>
  );
}