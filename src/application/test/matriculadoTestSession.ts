import { selectMatriculadoQuestions } from './selectMatriculadoQuestions';
import type { CourseId } from '../../domain/test/TestQuestion';
import type { QuestionAnswer } from '../../domain/test/QuestionAnswer';
import type { MatriculadoQuestion, QuestionType } from '../../domain/test/MatriculadoQuestion';

const SESSION_KEY = 'matriculado_test_session';
const MAX_SESSION_AGE_MS = 1000 * 60 * 60 * 2;

export type MatriculadoTestSession = {
  cursoId: CourseId;
  questions: MatriculadoQuestion[];
  answers: Record<string, QuestionAnswer>;
  currentIndex: number;
  startedAt: number;
};

export function loadOrCreateMatriculadoSession(cursoId: CourseId, formatFilter?: QuestionType[]): MatriculadoTestSession {
  const raw = sessionStorage.getItem(SESSION_KEY);

  if (raw) {
    const session: MatriculadoTestSession = JSON.parse(raw);
    const isExpired = Date.now() - session.startedAt > MAX_SESSION_AGE_MS;
    if (!isExpired && session.cursoId === cursoId) return session;
  }

  const session: MatriculadoTestSession = {
    cursoId,
    questions: selectMatriculadoQuestions(cursoId, formatFilter),
    answers: {},
    currentIndex: 0,
    startedAt: Date.now(),
  };
  saveMatriculadoSession(session);
  return session;
}

export function saveMatriculadoSession(session: MatriculadoTestSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearMatriculadoSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export { SESSION_KEY };