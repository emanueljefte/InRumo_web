
import { MATRICULADO_QUESTION_BANK, type MatriculadoQuestion } from '../../data/test/matriculdoQuestionBank';
import { AREAS } from '../../domain/test/Area';
import type { CourseId } from '../../domain/test/TestQuestion';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectMatriculadoQuestions(cursoId: CourseId): MatriculadoQuestion[] {
  const generic = MATRICULADO_QUESTION_BANK.filter((q) => q.categoria !== 'Área');
  const areaSpecific = MATRICULADO_QUESTION_BANK.filter(
    (q) => q.areaId && AREAS[q.areaId].cursoId === cursoId
  );

  // banco por área é pequeno (1-2 itens/área) — usa-se tudo, só o genérico (A/B) é embaralhado na ordem
  return shuffle([...generic, ...areaSpecific]);
}