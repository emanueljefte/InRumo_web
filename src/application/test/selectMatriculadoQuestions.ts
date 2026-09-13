
import { MATRICULADO_QUESTION_BANK, } from '../../data/test/matriculdoQuestionBank';
import { AREAS } from '../../domain/test/Area';
import type { MatriculadoQuestion, QuestionType } from '../../domain/test/MatriculadoQuestion';
import type { CourseId } from '../../domain/test/TestQuestion';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCourseIdForQuestion(q: MatriculadoQuestion): CourseId | null {
  switch (q.type) {
    case 'likert':
    case 'swipe':
      return q.areaId ? AREAS[q.areaId].cursoId : null; // sem areaId = genérica (Bloco A/B), fora do filtro por curso
    case 'scenario':
      return q.opcoes[0] ? AREAS[q.opcoes[0].areaId].cursoId : null;
    case 'ranking':
      return q.itens[0] ? AREAS[q.itens[0].areaId].cursoId : null;
  }
}

export function selectMatriculadoQuestions(cursoId: CourseId, formatFilter?: QuestionType[]): MatriculadoQuestion[] {
  const generic = MATRICULADO_QUESTION_BANK.filter((q) => getCourseIdForQuestion(q) === null);
  let areaSpecific = MATRICULADO_QUESTION_BANK.filter((q) => getCourseIdForQuestion(q) === cursoId);

  if (formatFilter && formatFilter.length > 0) {
    areaSpecific = areaSpecific.filter((q) => formatFilter.includes(q.type));
  }

  return shuffle([...generic, ...areaSpecific]);
}