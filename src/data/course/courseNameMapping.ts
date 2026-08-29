import type { CourseId } from '../../domain/test/TestQuestion';

const COURSE_NAME_TO_ID: Record<string, CourseId> = {
  'Engenharia Informática': 'eng-informatica',
  'Engenharia de Telecomunicações': 'eng-telecom',
  'Informática de Gestão': 'informatica-gestao',
};

export function mapCourseNameToId(name: string): CourseId {
  const id = COURSE_NAME_TO_ID[name.trim()];
  if (!id) throw new Error(`Curso desconhecido no ficheiro: "${name}"`);
  return id;
}