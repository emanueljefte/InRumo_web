import type { AreaId } from './Area';

export type AreaScore = {
  areaId: AreaId;
  totalScore: number;
  maxPossible: number;
  percentage: number;
};

export type AreaTestResult = {
  recommended: AreaScore;
  runnerUp: AreaScore | null; // null se o curso só tiver 1 área com perguntas (não é o caso aqui, mas protege)
  allScores: AreaScore[];
};