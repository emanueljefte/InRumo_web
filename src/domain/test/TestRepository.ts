import type { CourseId } from './TestQuestion';

export type SaveTestResultInput = {
  userId: string;
  recommendedCourseId: CourseId;
  isTie: boolean;
  runnerUpCourseId: CourseId | null;
  allScores: { courseId: CourseId; percentage: number }[];
};

export type TestRepository = {
  saveResult(input: SaveTestResultInput): Promise<void>;
  getResultHistory(userId: string): Promise<SaveTestResultInput[]>; // RF14, usado mais tarde
};