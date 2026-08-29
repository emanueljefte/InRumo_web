import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { rankScores, isResultAmbiguous } from '../quiz/matching';

type MatchScore = { id: string; name: string; score: number; isTopMatch: boolean };
type ResultDetail = { id: string; quizTitle: string; matches: MatchScore[]; isAmbiguous: boolean };

export function useQuizResultDetail(resultId: string | undefined) {
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!resultId) return;
    setLoading(true);

    const { data: row } = await supabase
      .from('user_results')
      .select('id, quiz_id, scores, top_matches')
      .eq('id', resultId)
      .single();

    if (!row) {
      setResult(null);
      setLoading(false);
      return;
    }

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

    setResult({
      id: row.id,
      quizTitle: quiz ? await resolveTargetName(quiz.target_type, quiz.target_id) : 'Teste',
      matches,
      isAmbiguous: isResultAmbiguous(row.scores),
    });
    setLoading(false);
  }, [resultId]);

  useEffect(() => {
    load();
  }, [load]);

  return { result, loading };
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