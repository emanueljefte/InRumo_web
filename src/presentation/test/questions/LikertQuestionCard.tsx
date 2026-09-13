import type { QuestionAnswer } from "../../../domain/test/QuestionAnswer";

export function LikertQuestionCard({ onAnswer }: { onAnswer: (a: QuestionAnswer) => void }) {
  return (
    <div className="grid grid-cols-5 gap-3 max-w-150 mx-auto">
      {[1, 2, 3, 4, 5].map((score) => (
        <button key={score} onClick={() => onAnswer({ type: 'likert', score: score as 1|2|3|4|5 })}
          className="w-14 h-14 rounded-full border border-outline-variant hover:border-primary hover:bg-primary-container/10 font-heading font-bold">
          {score}
        </button>
      ))}
    </div>
  );
}