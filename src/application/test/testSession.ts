import type { TestQuestion } from '../../domain/test/TestQuestion';
import { selectTestQuestions } from './selectTestQuestion';

export const SESSION_KEY = 'vocational_test_session';
const MAX_SESSION_AGE_MS = 1000 * 60 * 60 * 2; // 2h — depois disso, sorteia de novo (evita retomar dias depois com perguntas "erradas" na cabeça)

export type TestSession = {
  questions: TestQuestion[];
  answers: Record<string, number>;
  currentIndex: number;
  startedAt: number;
};

export function loadOrCreateTestSession(): TestSession {
  const raw = sessionStorage.getItem(SESSION_KEY);

  if (raw) {
    const session: TestSession = JSON.parse(raw);
    const isExpired = Date.now() - session.startedAt > MAX_SESSION_AGE_MS;
    if (!isExpired) return session;
  }

  const session: TestSession = {
    questions: selectTestQuestions(),
    answers: {},
    currentIndex: 0,
    startedAt: Date.now(),
  };
  saveTestSession(session);
  return session;
}

export function saveTestSession(session: TestSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearTestSession() {
  sessionStorage.removeItem(SESSION_KEY);
}