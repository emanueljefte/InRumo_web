import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import type { SaveTestResultInput } from '../../domain/test/TestRepository';
import type { TestRepository } from '../../domain/test/TestRepository';

export function useTestResult(testRepository: TestRepository) {
  const { session } = useAuth();
  const [result, setResult] = useState<SaveTestResultInput | null>(null);
  
  useEffect(() => {
    if (!session) return; // sem setState aqui — loading deriva de session ausente

    let ignore = false;

    testRepository.getResultHistory(session.user.id).then((history) => {
      if (!ignore) setResult(history[0] ?? null);
    });

    return () => {
      ignore = true;
    };
  }, [session, testRepository]);

  const loading = Boolean(session) && result === undefined;

  return { result: result ?? null, loading };
}