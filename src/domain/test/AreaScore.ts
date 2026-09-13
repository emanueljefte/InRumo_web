import type { AreaId } from './Area';

export type AreaScore = {
  areaId: AreaId;
  totalScore: number;
  maxPossible: number;
  percentage: number;
};

export type AreaTestResult = {
  recommended: AreaScore;
  runnerUp: AreaScore | null;
  allScores: AreaScore[];
};