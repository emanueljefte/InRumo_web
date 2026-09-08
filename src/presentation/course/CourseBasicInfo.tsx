import { BookOpen, GraduationCap, Layers } from "lucide-react";
import type { Course } from "../../domain/course/Course";

export function CourseBasicInfo({ course }: { course: Course }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body text-[#1a1b22] antialiased">
      
      {/* Cabeçalho do Curso */}
      <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Curso de Licenciatura</span>
        </div>
        
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1b22] tracking-tight leading-snug">
          {course.name}
        </h1>
        
        <p className="font-body text-sm sm:text-base text-[#504536] leading-relaxed max-w-3xl">
          {course.description}
        </p>
      </div>

      {/* Áreas do Curso */}
      <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-[#1a1b22]">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight">
            Áreas do curso
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {course.areas.map((area) => (
            <span
              key={area}
              className="bg-[#f5f3ff] border border-primary/15 text-primary text-xs font-medium px-3.5 py-2 rounded-xl transition-colors hover:bg-primary/10"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Grade Curricular */}
      <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 text-[#1a1b22]">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight">
            Grade curricular
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {course.curriculum.map((disciplina) => (
            <li
              key={disciplina}
              className="bg-[#fbf8ff] border border-[#e8e7f1] rounded-2xl px-4 py-3 text-xs font-medium text-[#1a1b22] flex items-center gap-3 group hover:border-primary/40 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform" />
              <span className="leading-relaxed">{disciplina}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}