
import { MATRICULADO_QUESTION_BANK, } from '../../data/test/matriculdoQuestionBank';
import { AREAS, type AreaId } from '../../domain/test/Area';
import type { MatriculadoQuestion, QuestionType } from '../../domain/test/MatriculadoQuestion';
import type { CourseId } from '../../domain/test/TestQuestion';

const GENERIC_SAMPLE_SIZE = 4; // do bloco A+B, só uma amostra
const AREA_QUESTIONS_PER_TYPE = { likert: 2, scenario: 1, ranking: 1, swipe: 2 }; // por área
const MIXED_QUESTIONS_PER_TYPE: Record<QuestionType, number> = { likert: 2, scenario: 1, ranking: 1, swipe: 1 };

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
  const isMixed = !formatFilter || formatFilter.length === 0;
  const perType = isMixed ? MIXED_QUESTIONS_PER_TYPE : AREA_QUESTIONS_PER_TYPE;

  const includeGeneric = isMixed || (formatFilter && formatFilter.includes('likert'));
  const generic = includeGeneric
    ? shuffle(MATRICULADO_QUESTION_BANK.filter((q) => getCourseIdForQuestion(q) === null)).slice(0, GENERIC_SAMPLE_SIZE)
    : [];

  const areaIds = (Object.keys(AREAS) as AreaId[]).filter((id) => AREAS[id].cursoId === cursoId);

  const areaSpecific: MatriculadoQuestion[] = [];
  areaIds.forEach((areaId) => {
    const pool = MATRICULADO_QUESTION_BANK.filter((q) => {
      if (!isMixed && formatFilter && !formatFilter.includes(q.type)) return false;
      if (q.type === 'likert' || q.type === 'swipe') return q.areaId === areaId;
      if (q.type === 'scenario') return q.opcoes.some((o) => o.areaId === areaId);
      if (q.type === 'ranking') return q.itens.some((i) => i.areaId === areaId);
      return false;
    });

    (Object.keys(perType) as QuestionType[]).forEach((type) => {
      const count = perType[type];
      if (count === 0) return;
      const ofType = pool.filter((q) => q.type === type);
      areaSpecific.push(...shuffle(ofType).slice(0, count));
    });
  });

  const unique = Array.from(new Map(areaSpecific.map((q) => [q.id, q])).values());
  return shuffle([...generic, ...unique]);
}