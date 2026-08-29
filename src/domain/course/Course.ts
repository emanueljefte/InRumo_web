import type { CourseId } from "../test/TestQuestion";

export type Course = {
  id: CourseId;
  name: string;
  description: string;
  curriculum: string[]; // grade curricular simplificada, nomes de disciplinas
  areas: string[]; // áreas dentro do curso (RF07)
};