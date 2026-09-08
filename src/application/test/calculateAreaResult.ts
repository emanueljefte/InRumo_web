import { AREAS, type AreaId } from '../../domain/test/Area';
import type { CourseId } from '../../domain/test/TestQuestion';
import type { AreaScore, AreaTestResult } from '../../domain/test/AreaScore';
import { MATRICULADO_QUESTION_BANK } from '../../data/test/matriculdoQuestionBank';

const TIE_THRESHOLD = 3;

export function isAreaTie(result: AreaTestResult): boolean {
  if (!result.runnerUp) return false;
  return Math.abs(result.recommended.percentage - result.runnerUp.percentage) <= TIE_THRESHOLD;
}

export function calculateAreaResult(answers: Record<string, number>, cursoId: CourseId): AreaTestResult {
  const areaIds = (Object.keys(AREAS) as AreaId[]).filter((id) => AREAS[id].cursoId === cursoId);

  const allScores: AreaScore[] = areaIds.map((areaId) => {
    const questionIds = MATRICULADO_QUESTION_BANK
      .filter((q) => q.areaId === areaId)
      .map((q) => q.id)
      .filter((id) => id in answers);

    const totalScore = questionIds.reduce((sum, id) => sum + answers[id], 0);
    const maxPossible = questionIds.length * 5;

    return {
      areaId,
      totalScore,
      maxPossible,
      percentage: maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0,
    };
  });

  const sorted = [...allScores].sort((a, b) => b.percentage - a.percentage);

  return { recommended: sorted[0], runnerUp: sorted[1] ?? null, allScores: sorted };
}