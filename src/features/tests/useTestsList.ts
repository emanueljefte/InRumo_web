import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../application/auth/useAuth';

export type QuizStatus = 'not_started' | 'in_progress' | 'completed';

type QuizListItem = {
  id: string;
  title: string;
  targetTypeLabel: string;
  questionCount: number;
  status: QuizStatus;
  progressPercent: number;
};

export function useTestsList() {
  const { session } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    const userId = session.user.id;

    const [{ data: allQuizzes }, { data: allQuestions }, { data: allAnswers }, { data: allResults }] =
      await Promise.all([
        supabase.from('quizzes').select('id, target_type, target_id'),
        supabase.from('questions').select('id, quiz_id'),
        supabase.from('user_answers').select('quiz_id, question_id').eq('user_id', userId),
        supabase.from('user_results').select('quiz_id').eq('user_id', userId),
      ]);

    const completedIds = new Set((allResults ?? []).map((r) => r.quiz_id));
    const questionsByQuiz = groupBy(allQuestions ?? [], (q) => q.quiz_id);
    const answersByQuiz = groupBy(allAnswers ?? [], (a) => a.quiz_id);

    const items = await Promise.all(
      (allQuizzes ?? []).map(async (q) => {
        const total = questionsByQuiz[q.id]?.length ?? 0;
        const answered = new Set(answersByQuiz[q.id]?.map((a) => a.question_id)).size;

        const status: QuizStatus = completedIds.has(q.id)
          ? 'completed'
          : answered > 0
            ? 'in_progress'
            : 'not_started';

        return {
          id: q.id,
          title: await resolveTargetName(q.target_type, q.target_id),
          targetTypeLabel: q.target_type === 'course' ? 'Curso' : q.target_id ? 'Área' : 'Geral',
          questionCount: total,
          status,
          progressPercent: total > 0 ? Math.round((answered / total) * 100) : 0,
        };
      }),
    );

    setQuizzes(items);
    setLoading(false);
  }, [session?.user?.id]);

  // useEffect(() => {
  //   load();
  // }, [load]);

  return { quizzes, loading, refresh: load };
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

function groupBy<T, K extends string>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}