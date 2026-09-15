import { useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Sparkles } from "lucide-react";
import { COURSE_LABELS } from "../domain/course/courseLabels";
import type { SaveTestResultInput } from "../domain/test/TestRepository";
import type { CourseId } from "../domain/test/TestQuestion";

interface RecommendedCourseCardProps {
  result: SaveTestResultInput & { recommendedCourseId: CourseId };
}

export function RecommendedCourseCard({ result }: RecommendedCourseCardProps) {
  const navigate = useNavigate();
  const courseName = COURSE_LABELS[result.recommendedCourseId] ?? result.recommendedCourseId;

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-primary-container/15 rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-5 shadow-xs transition-all hover:shadow-md">
      
      {/* Badge e Tag de Destaque */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-primary-container/80 text-on-primary-container text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-primary/10 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          O teu curso recomendado
        </span>
      </div>

      {/* Título do Curso e Descrição Curta */}
      <div className="space-y-1.5">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-tight">
          {courseName}
        </h2>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Com base no teu perfil vocacional e nas tuas aptidões técnicas, este é o curso da INSTIC que melhor se alinha com o teu futuro.
        </p>
      </div>

      {/* Ações / Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(`/course/${result.recommendedCourseId}`)}
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xs hover:shadow-primary/20 cursor-pointer group"
        >
          <span>Ver detalhes completos</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/candidate/chat')}
          className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/70 text-on-surface font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 text-primary" />
          <span>Falar com o Orientador IA</span>
        </button>
      </div>

    </div>
  );
}