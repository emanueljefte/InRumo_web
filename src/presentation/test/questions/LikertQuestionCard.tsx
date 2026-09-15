import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

interface LikertQuestionCardProps {
  onAnswer: (answer: QuestionAnswer) => void;
}

export function LikertQuestionCard({ onAnswer }: LikertQuestionCardProps) {
  const options = [
    { score: 1, label: 'Discordo totalmente' },
    { score: 2, label: 'Discordo' },
    { score: 3, label: 'Neutro' },
    { score: 4, label: 'Concordo' },
    { score: 5, label: 'Concordo totalmente' },
  ] as const;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {options.map((opt) => (
          <button
            key={opt.score}
            type="button"
            onClick={() => onAnswer({ type: 'likert', score: opt.score })}
            className="group flex flex-col items-center gap-2 focus:outline-none"
          >
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 border-outline-variant bg-surface-container-lowest 
                         group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-md 
                         active:scale-95 transition-all duration-200 flex flex-col items-center justify-center font-heading font-bold text-lg sm:text-xl text-on-surface"
            >
              <span>{opt.score}</span>
              <span className="text-[10px] font-normal opacity-60 -mt-1 hidden sm:block group-hover:text-on-primary">
                [{opt.score}]
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-center font-medium text-outline group-hover:text-primary transition-colors line-clamp-2">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-outline px-1 font-medium">
        <span>1 = Discordo</span>
        <span>5 = Concordo</span>
      </div>
    </div>
  );
}