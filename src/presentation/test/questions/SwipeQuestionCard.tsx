import { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

interface SwipeQuestionCardProps {
  onAnswer: (answer: QuestionAnswer) => void;
}

export function SwipeQuestionCard({ onAnswer }: SwipeQuestionCardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onAnswer({ type: 'swipe', direction: 'left' });
      if (e.key === 'ArrowRight') onAnswer({ type: 'swipe', direction: 'right' });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAnswer]);

  return (
    <div className="flex flex-col items-center gap-6 pt-4 w-full">
      <div className="flex justify-center items-center gap-8 sm:gap-12">
        {/* Opção Rejeitar / Não Gosto */}
        <div className="flex flex-col items-center gap-2 group">
          <button
            type="button"
            onClick={() => onAnswer({ type: 'swipe', direction: 'left' })}
            aria-label="Não me identifico"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-error/30 bg-error/5 text-error 
                       flex items-center justify-center group-hover:bg-error group-hover:text-white group-hover:border-error 
                       active:scale-90 transition-all duration-200 shadow-xs"
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
          <span className="text-xs font-semibold text-outline group-hover:text-error transition-colors">
            Não me identifico [←]
          </span>
        </div>

        {/* Opção Aceitar / Gosto */}
        <div className="flex flex-col items-center gap-2 group">
          <button
            type="button"
            onClick={() => onAnswer({ type: 'swipe', direction: 'right' })}
            aria-label="Identifico-me totalmente"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary/30 bg-primary/5 text-primary 
                       flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary 
                       active:scale-90 transition-all duration-200 shadow-xs"
          >
            <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
          </button>
          <span className="text-xs font-semibold text-outline group-hover:text-primary transition-colors">
            Identifico-me [→]
          </span>
        </div>
      </div>
    </div>
  );
}