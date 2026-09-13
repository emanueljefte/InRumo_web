import { Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useTestResult } from '../../application/test/useTestResult';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';

export function RequireTestCompleted({ children }: { children: React.ReactNode }) {
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const { result, loading } = useTestResult(testRepository);

  if (loading) return null;
  if (!result?.recommendedCourseId) return <Navigate to="/candidate/test" replace />;

  return <>{children}</>;
}