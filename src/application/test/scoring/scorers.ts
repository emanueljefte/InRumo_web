import type { AreaId } from '../../../domain/test/Area';
import type { MatriculadoQuestion } from '../../../domain/test/MatriculadoQuestion';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

export type ScoreEntry = { areaId: AreaId; points: number; maxPoints: number };

type Scorer = (question: MatriculadoQuestion, answer: QuestionAnswer) => ScoreEntry[];

const scoreLikert: Scorer = (q, a) => {
  if (q.type !== 'likert' || a.type !== 'likert') return [];
  if (!q.areaId) return []
  return [{ areaId: q.areaId, points: a.score, maxPoints: 5 }];
};

const scoreScenario: Scorer = (q, a) => {
  if (q.type !== 'scenario' || a.type !== 'scenario') return [];
  return q.opcoes.map((opt) => ({
    areaId: opt.areaId,
    points: opt.id === a.optionId ? 5 : 0,
    maxPoints: 5,
  }));
};

const scoreRanking: Scorer = (q, a) => {
  if (q.type !== 'ranking' || a.type !== 'ranking') return [];
  const total = q.itens.length;
  return a.orderedItemIds.map((itemId, index) => {
    const item = q.itens.find((i) => i.id === itemId);
    if (!item) return null;
    const points = total - index; // 1º lugar = total pontos, último = 1
    return { areaId: item.areaId, points, maxPoints: total };
  }).filter((x): x is ScoreEntry => x !== null);
};

const scoreSwipe: Scorer = (q, a) => {
  if (q.type !== 'swipe' || a.type !== 'swipe') return [];
  return [{ areaId: q.areaId, points: a.direction === 'right' ? 5 : 1, maxPoints: 5 }];
};

// registo central — único sítio a tocar ao adicionar um formato novo
const SCORERS: Record<QuestionAnswer['type'], Scorer> = {
  likert: scoreLikert,
  scenario: scoreScenario,
  ranking: scoreRanking,
  swipe: scoreSwipe,
};

export function scoreQuestion(question: MatriculadoQuestion, answer: QuestionAnswer): ScoreEntry[] {
  return SCORERS[answer.type](question, answer);
}