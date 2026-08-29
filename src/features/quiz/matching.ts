import type { QuestionWeightMap, ChoiceOption, ScaleWeightMap } from './types';

type QuestionForScoring = {
  id: string;
  type: 'single_choice' | 'multi_choice' | 'scale';
  weightMap: QuestionWeightMap;
};

type ScoringResult = {
  scores: Record<string, number>;
  topMatches: string[];
};

export const AMBIGUITY_THRESHOLD = 15;

export type RankedMatch = { id: string; score: number; isTopMatch: boolean };

export function rankScores(scores: Record<string, number>, limit = 5): RankedMatch[] {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0]?.[1] ?? 0;
  return sorted.slice(0, limit).map(([id, score]) => ({
    id, score, isTopMatch: topScore - score < AMBIGUITY_THRESHOLD,
  }));
}

export function isResultAmbiguous(scores: Record<string, number>): boolean {
  const sorted = Object.values(scores).sort((a, b) => b - a);
  if (sorted.length < 2) return false;
  return sorted[0] - sorted[1] < AMBIGUITY_THRESHOLD;
}

export function calculateQuizResult(
  questions: QuestionForScoring[],
  answersMap: Record<string, string[]>,
): ScoringResult {
  const raw: Record<string, number> = {};
  const maxPossible: Record<string, number> = {};

  for (const question of questions) {
    const answer = answersMap[question.id];
    if (!answer || answer.length === 0) continue;

    if (question.type === 'scale') {
      const { targets } = question.weightMap as ScaleWeightMap;
      const rating = Number(answer[0]);
      for (const [targetId, weight] of Object.entries(targets)) {
        raw[targetId] = (raw[targetId] ?? 0) + weight * rating;
        maxPossible[targetId] = (maxPossible[targetId] ?? 0) + weight * 5;
      }
      continue;
    }

    const optionMap = question.weightMap as Record<string, ChoiceOption>;
    for (const optionId of answer) {
      const option = optionMap[optionId];
      if (!option) continue;
      for (const [targetId, weight] of Object.entries(option.weights)) {
        raw[targetId] = (raw[targetId] ?? 0) + weight;
        maxPossible[targetId] = (maxPossible[targetId] ?? 0) + weight;
      }
    }
  }

  const scores: Record<string, number> = {};
  for (const targetId of Object.keys(raw)) {
    const max = maxPossible[targetId] || 1;
    scores[targetId] = Math.round((raw[targetId] / max) * 100);
  }

  const ranked = rankScores(scores, Object.keys(scores).length);
  const topMatches = ranked.filter((m) => m.isTopMatch).map((m) => m.id);

  return { scores, topMatches };
}