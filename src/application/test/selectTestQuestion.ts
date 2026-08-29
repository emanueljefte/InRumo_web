import { QUESTION_BANK, type CourseId } from '../../data/test/questionBank';
import type { TestQuestion } from '../../domain/test/TestQuestion';

const QUESTIONS_PER_COURSE = 6;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectTestQuestions(): TestQuestion[] {
  const courseIds: CourseId[] = ['eng-informatica', 'eng-telecom', 'informatica-gestao'];

  const selected = courseIds.flatMap((courseId) => {
    const pool = QUESTION_BANK.filter((q) => q.courseId === courseId);
    return shuffle(pool).slice(0, QUESTIONS_PER_COURSE);
  });

  return shuffle(selected);
}