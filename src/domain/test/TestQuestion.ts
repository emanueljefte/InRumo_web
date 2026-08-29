export type CourseId = 'eng-informatica' | 'eng-telecom' | 'informatica-gestao';

export type TestQuestion = {
  id: string;
  category: string;
  statement: string;
  courseId: CourseId;
};