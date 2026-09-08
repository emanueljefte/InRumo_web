import { Briefcase, Calendar, Quote } from 'lucide-react';
import { COURSE_BENEFITS } from '../../data/course/courseBenefits';
import type { CourseId } from '../../domain/test/TestQuestion';

export function CourseDeepBenefits({ courseId }: { courseId: CourseId }) {
  const benefits = COURSE_BENEFITS[courseId];

  return (
    <div className="mt-10 pt-8 border-t border-[#e8e7f1] space-y-8 font-body text-[#1a1b22] antialiased">

      {/* Saídas Profissionais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 text-[#1a1b22]">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Briefcase className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight">
            Saídas profissionais
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {benefits.outcomes.map((outcome) => (
            <div
              key={outcome}
              className="bg-white border border-[#e8e7f1] rounded-2xl p-4 transition-all hover:border-primary/40 hover:shadow-xs flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="font-body text-xs font-semibold text-[#1a1b22] leading-snug">
                {outcome}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* No Primeiro Ano */}
      <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-[#1a1b22]">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight">
            No primeiro ano
          </h2>
        </div>

        <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed max-w-3xl">
          {benefits.firstYearGlimpse}
        </p>
      </div>

      {/* Testemunho */}
      <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-3xl border border-primary/15 p-6 sm:p-8 overflow-hidden">
        <Quote className="absolute -right-2 -bottom-2 w-24 h-24 text-primary/10 pointer-events-none" />
        <p className="font-body text-xs sm:text-sm text-[#1a1b22] italic leading-relaxed relative z-10">
          "{benefits.testimonial}"
        </p>
      </div>

    </div>
  );
}