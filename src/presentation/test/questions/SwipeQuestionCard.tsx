import { X, Heart } from 'lucide-react';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

export function SwipeQuestionCard({ onAnswer }: { onAnswer: (a: QuestionAnswer) => void }) {
  return (
    <div className="flex justify-center gap-8 pt-6">
      <button onClick={() => onAnswer({ type: 'swipe', direction: 'left' })}
        className="w-16 h-16 rounded-full border-2 border-error/40 text-error flex items-center justify-center hover:bg-error/10">
        <X className="w-6 h-6" />
      </button>
      <button onClick={() => onAnswer({ type: 'swipe', direction: 'right' })}
        className="w-16 h-16 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary-container/10">
        <Heart className="w-6 h-6" />
      </button>
    </div>
  );
}