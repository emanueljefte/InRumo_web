import type { Course } from "../../domain/course/Course";

export function CourseBasicInfo({ course }: { course: Course }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">{course.name}</h1>
        <p className="font-body-md text-on-surface-variant mt-2 max-w-2xl">{course.description}</p>
      </div>

      <div>
        <h2 className="font-heading text-headline-sm text-on-surface mb-3">Áreas do curso</h2>
        <div className="flex flex-wrap gap-2">
          {course.areas.map((area) => (
            <span key={area} className="bg-surface-container text-on-surface-variant text-xs font-medium px-3 py-1.5 rounded-full">
              {area}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-headline-sm text-on-surface mb-3">Grade curricular</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {course.curriculum.map((disciplina) => (
            <li key={disciplina} className="font-body-sm text-on-surface-variant flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {disciplina}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}