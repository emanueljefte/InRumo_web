import { useState } from 'react';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import type { RankingQuestion } from '../../../domain/test/MatriculadoQuestion';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

interface RankingQuestionCardProps {
  question: RankingQuestion;
  onAnswer: (answer: QuestionAnswer) => void;
}

export function RankingQuestionCard({ question, onAnswer }: RankingQuestionCardProps) {
  const [order, setOrder] = useState<string[]>(() => question.itens.map((i) => i.id));

  function move(index: number, dir: -1 | 1) {
    const newOrder = [...order];
    const target = index + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setOrder(newOrder);
  }

  return (
    <div className="space-y-6 w-full">
      <p className="text-xs text-outline font-medium">
        Usa as setas para colocar os itens pela tua ordem de preferência (do 1º ao último):
      </p>

      <div className="space-y-3">
        {order.map((id, index) => {
          const item = question.itens.find((i) => i.id === id)!;
          const isTop = index === 0;

          return (
            <div
              key={id}
              className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                isTop
                  ? 'border-primary/40 bg-primary-container/10 shadow-xs'
                  : 'border-outline-variant bg-surface-container-lowest'
              }`}
            >
              <div className="flex items-center gap-2 shrink-0">
                <GripVertical className="w-4 h-4 text-outline/60" />
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-heading text-xs font-bold ${
                    isTop
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {index + 1}º
                </span>
              </div>

              <span className="font-body-sm sm:font-body text-sm sm:text-base text-on-surface font-medium flex-1 leading-snug">
                {item.texto}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Mover para cima"
                  className="p-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container 
                             disabled:opacity-20 disabled:hover:bg-transparent text-on-surface transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label="Mover para baixo"
                  className="p-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container 
                             disabled:opacity-20 disabled:hover:bg-transparent text-on-surface transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onAnswer({ type: 'ranking', orderedItemIds: order })}
        className="w-full bg-primary text-on-primary hover:bg-primary/90 font-heading font-semibold py-4 rounded-2xl 
                   shadow-sm active:scale-[0.99] transition-all duration-200 text-sm sm:text-base"
      >
        Confirmar Ordem
      </button>
    </div>
  );
}