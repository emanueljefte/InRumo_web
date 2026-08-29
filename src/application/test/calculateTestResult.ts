import { QUESTION_BANK } from '../../data/test/questionBank';
import type { CourseId } from '../../domain/test/TestQuestion';

export type CourseScore = {
  courseId: CourseId;
  totalScore: number;
  maxPossible: number;
  percentage: number;
};

export type TestResult = {
  recommended: CourseScore;
  runnerUp: CourseScore;
  allScores: CourseScore[];
};

const COURSE_IDS: CourseId[] = ['eng-informatica', 'eng-telecom', 'informatica-gestao'];
const TIE_THRESHOLD = 3; // pontos percentuais

export function isTie(result: TestResult): boolean {
  return Math.abs(result.recommended.percentage - result.runnerUp.percentage) <= TIE_THRESHOLD;
}

export function calculateTestResult(answers: Record<string, number>): TestResult {
  const allScores: CourseScore[] = COURSE_IDS.map((courseId) => {
    const questionIds = Object.keys(answers).filter(
      (id) => QUESTION_BANK.find((q) => q.id === id)?.courseId === courseId
    );
    const totalScore = questionIds.reduce((sum, id) => sum + answers[id], 0);
    const maxPossible = questionIds.length * 5;

    return {
      courseId,
      totalScore,
      maxPossible,
      percentage: maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0,
    };
  });

  const sorted = [...allScores].sort((a, b) => b.percentage - a.percentage);

  return { recommended: sorted[0], runnerUp: sorted[1], allScores: sorted };
}