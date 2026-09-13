import type { ScenarioQuestion } from "../../../domain/test/MatriculadoQuestion";
import type { QuestionAnswer } from "../../../domain/test/QuestionAnswer";

export function ScenarioQuestionCard({ question, onAnswer }: { question: ScenarioQuestion; onAnswer: (a: QuestionAnswer) => void }) {
  return (
    <div className="space-y-3">
      {question.opcoes.map((opt) => (
        <button key={opt.id} onClick={() => onAnswer({ type: 'scenario', optionId: opt.id })}
          className="w-full text-left p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-container/10">
          {opt.texto}
        </button>
      ))}
    </div>
  );
}