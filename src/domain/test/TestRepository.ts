import type { AreaId } from './Area';
import type { CourseId } from './TestQuestion';

export type SaveTestResultInput = {
  userId: string;
  recommendedCourseId?: CourseId;       // candidato
  recommendedAreaId?: AreaId;           // matriculado
  isTie: boolean;
  runnerUpCourseId?: CourseId | null;
  runnerUpAreaId?: AreaId | null;
  allScores: { courseId?: CourseId; areaId?: AreaId; percentage: number }[];
};

export type TestRepository = {
  saveResult(input: SaveTestResultInput): Promise<void>;
  getResultHistory(userId: string): Promise<SaveTestResultInput[]>; // RF14, usado mais tarde
};