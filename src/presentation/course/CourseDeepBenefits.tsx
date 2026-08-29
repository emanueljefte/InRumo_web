import { COURSE_BENEFITS } from '../../data/course/courseBenefits';
import type { CourseId } from '../../domain/test/TestQuestion';

export function CourseDeepBenefits({ courseId }: { courseId: CourseId }) {
  const benefits = COURSE_BENEFITS[courseId];

  return (
    <div className="mt-10 pt-8 border-t border-outline-variant/50 space-y-8">
      <div>
        <h2 className="font-heading text-headline-sm text-on-surface mb-3">Saídas profissionais</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {benefits.outcomes.map((outcome) => (
            <div key={outcome} className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4">
              <p className="font-body-sm font-medium text-on-surface">{outcome}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-headline-sm text-on-surface mb-3">No primeiro ano</h2>
        <p className="font-body-sm text-on-surface-variant leading-relaxed max-w-2xl">{benefits.firstYearGlimpse}</p>
      </div>

      <div className="bg-primary-container/10 rounded-2xl p-6">
        <p className="font-body-md text-on-surface italic leading-relaxed">{benefits.testimonial}</p>
      </div>
    </div>
  );
}