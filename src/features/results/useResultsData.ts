import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { rankScores, isResultAmbiguous } from '../quiz/matching';

type MatchScore = { id: string; name: string; score: number; isTopMatch: boolean };

export type ResultSummary = {
  id: string;
  quizTitle: string;
  completedAtLabel: string;
  matches: MatchScore[];
  isAmbiguous: boolean;
};

export function useResultsData() {
  const { session } = useAuth();
  const [results, setResults] = useState<ResultSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);

    const { data: rows } = await supabase
      .from('user_results')
      .select('id, quiz_id, scores, computed_at')
      .eq('user_id', session.user.id)
      .order('computed_at', { ascending: false });

    const summaries = await Promise.all((rows ?? []).map(buildSummary));
    setResults(summaries);
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { results, loading, refresh: load };
}

async function buildSummary(row: {
  id: string; quiz_id: string; scores: Record<string, number>; computed_at: string;
}): Promise<ResultSummary> {
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('target_type, target_id')
    .eq('id', row.quiz_id)
    .single();

  const ranked = rankScores(row.scores, 5);

  const matches = await Promise.all(
    ranked.map(async (m) => ({
      id: m.id,
      name: await resolveTargetName(quiz?.target_type ?? 'course', m.id),
      score: m.score,
      isTopMatch: m.isTopMatch,
    })),
  );

  return {
    id: row.id,
    quizTitle: quiz ? await resolveTargetName(quiz.target_type, quiz.target_id) : 'Teste',
    completedAtLabel: formatDate(new Date(row.computed_at)),
    matches,
    isAmbiguous: isResultAmbiguous(row.scores),
  };
}

async function resolveTargetName(targetType: 'course' | 'area', targetId: string | null): Promise<string> {
  if (!targetId) return 'Teste vocacional geral';
  if (targetType === 'course') {
    const { data } = await supabase.from('courses').select('name').eq('id', targetId).single();
    return data?.name ?? 'Curso';
  }
  const { data } = await supabase.from('course_areas').select('name').eq('id', targetId).single();
  return data?.name ?? 'Área';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}