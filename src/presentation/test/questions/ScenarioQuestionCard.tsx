import type { ScenarioQuestion } from '../../../domain/test/MatriculadoQuestion';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

interface ScenarioQuestionCardProps {
  question: ScenarioQuestion;
  onAnswer: (answer: QuestionAnswer) => void;
}

export function ScenarioQuestionCard({ question, onAnswer }: ScenarioQuestionCardProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-3.5 w-full">
      {question.opcoes.map((opt, idx) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onAnswer({ type: 'scenario', optionId: opt.id })}
          className="group w-full text-left p-4 sm:p-5 rounded-2xl border border-outline-variant bg-surface-container-lowest 
                     hover:border-primary hover:bg-primary-container/15 hover:shadow-sm 
                     active:scale-[0.99] transition-all duration-200 ease-out flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <span
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-surface-container-high text-on-surface-variant 
                       group-hover:bg-primary group-hover:text-on-primary font-heading font-bold text-xs shrink-0 transition-colors duration-200"
          >
            {optionLabels[idx] ?? idx + 1}
          </span>
          <span className="font-body text-sm sm:text-base text-on-surface group-hover:text-on-surface-variant leading-relaxed pt-0.5 flex-1">
            {opt.texto}
          </span>
        </button>
      ))}
    </div>
  );
}