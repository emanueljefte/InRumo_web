import { useNavigate } from "react-router-dom";
import { COURSE_LABELS } from "../domain/course/courseLabels";
import type { SaveTestResultInput } from "../domain/test/TestRepository";

export function RecommendedCourseCard({ result }: { result: SaveTestResultInput }) {
  const navigate = useNavigate();
  return (
    <div className="bg-linear-to-br from-surface-container-lowest via-white to-primary-container/10 rounded-3xl border border-outline-variant/60 p-8 space-y-4">
      <span className="bg-primary-container/60 text-on-primary-container text-xs font-bold uppercase px-3.5 py-1.5 rounded-full">
        O teu curso recomendado
      </span>
      <h2 className="font-heading text-2xl font-bold text-on-surface">
        {COURSE_LABELS[result.recommendedCourseId]}
      </h2>
      <div className="flex gap-3 pt-2">
        <button onClick={() => navigate(`/candidate/course/${result.recommendedCourseId}`)} className="bg-primary-container text-on-primary-container font-semibold px-5 py-3 rounded-xl">
          Ver detalhes completos
        </button>
        <button onClick={() => navigate('/candidate/chat')} className="border font-medium px-5 py-3 rounded-xl">
          Falar com o Orientador IA
        </button>
      </div>
    </div>
  );
}