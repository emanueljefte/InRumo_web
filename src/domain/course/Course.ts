import type { CourseId } from "../test/TestQuestion";

export type CurriculumSemester = { semestre: string; disciplinas: string[] };
export type CurriculumYear = { ano: string; etapa: string | null; semestres: CurriculumSemester[] };

export type Course = {
  id: CourseId;
  name: string;
  description: string;
  curriculum: CurriculumYear[]; // grade curricular simplificada, nomes de disciplinas
  areas: string[]; // áreas dentro do curso (RF07)
  outcomes: string[]
};