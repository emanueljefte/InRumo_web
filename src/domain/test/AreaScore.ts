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

export type StoredAreaResult = {
  recommendedAreaId: AreaId;
  isTie: boolean;
  runnerUpAreaId: AreaId | null;
  allScores: { areaId: AreaId; percentage: number }[];
};
