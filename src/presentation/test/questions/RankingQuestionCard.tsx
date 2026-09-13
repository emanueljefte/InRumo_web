import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import type { RankingQuestion } from '../../../domain/test/MatriculadoQuestion';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

export function RankingQuestionCard({ question, onAnswer }: { question: RankingQuestion; onAnswer: (a: QuestionAnswer) => void }) {
  const [order, setOrder] = useState(question.itens.map((i) => i.id));

  function move(index: number, dir: -1 | 1) {
    const newOrder = [...order];
    const target = index + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setOrder(newOrder);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {order.map((id, index) => {
          const item = question.itens.find((i) => i.id === id)!;
          return (
            <div key={id} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface-container-lowest">
              <GripVertical className="w-4 h-4 text-outline shrink-0" />
              <span className="font-body-sm text-on-surface flex-1">{index + 1}. {item.texto}</span>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="text-xs disabled:opacity-30">▲</button>
                <button onClick={() => move(index, 1)} disabled={index === order.length - 1} className="text-xs disabled:opacity-30">▼</button>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => onAnswer({ type: 'ranking', orderedItemIds: order })}
        className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl">
        Confirmar ordem
      </button>
    </div>
  );
}