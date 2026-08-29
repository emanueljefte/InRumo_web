import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COURSES_TEASER } from '../../data/course/coursesTeaser';

export function CoursesCatalogTeaser() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-headline-sm text-on-surface">Cursos disponíveis</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {COURSES_TEASER.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/course/${course.id}`)}
            className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 hover:border-primary transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-container/70 flex items-center justify-center text-on-primary-container mb-3">
              <course.icon className="w-4 h-4" />
            </div>
            <h3 className="font-heading text-body-lg font-semibold text-on-surface mb-1">{course.title}</h3>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">{course.desc}</p>
            <span className="font-body-sm text-primary font-medium text-xs flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
              Ver detalhes <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}