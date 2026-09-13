import { AREAS, type AreaId } from '../../domain/test/Area';
import type { CourseId } from '../../domain/test/TestQuestion';
import type { AreaScore, AreaTestResult } from '../../domain/test/AreaScore';
import type { MatriculadoQuestion } from '../../domain/test/MatriculadoQuestion';
import type { QuestionAnswer } from '../../domain/test/QuestionAnswer';
import { scoreQuestion } from './scoring/scorers';

const TIE_THRESHOLD = 3;

export function isAreaTie(result: AreaTestResult): boolean {
  if (!result.runnerUp) return false;
  return Math.abs(result.recommended.percentage - result.runnerUp.percentage) <= TIE_THRESHOLD;
}

export function calculateAreaResult(
  questions: MatriculadoQuestion[],
  answers: Record<string, QuestionAnswer>,
  cursoId: CourseId,
): AreaTestResult {
  const areaIds = (Object.keys(AREAS) as AreaId[]).filter((id) => AREAS[id].cursoId === cursoId);
  const totals: Record<string, { points: number; maxPoints: number }> = {};
  areaIds.forEach((id) => { totals[id] = { points: 0, maxPoints: 0 }; });

  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer) continue;

    const entries = scoreQuestion(question, answer);
    entries.forEach((entry) => {
      if (!totals[entry.areaId]) return; // ignora áreas fora deste curso
      totals[entry.areaId].points += entry.points;
      totals[entry.areaId].maxPoints += entry.maxPoints;
    });
  }

  const allScores: AreaScore[] = areaIds.map((areaId) => ({
    areaId,
    totalScore: totals[areaId].points,
    maxPossible: totals[areaId].maxPoints,
    percentage: totals[areaId].maxPoints > 0 ? (totals[areaId].points / totals[areaId].maxPoints) * 100 : 0,
  }));

  const sorted = [...allScores].sort((a, b) => b.percentage - a.percentage);
  return { recommended: sorted[0], runnerUp: sorted[1] ?? null, allScores: sorted };
}