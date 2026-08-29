import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';

type SuggestedQuiz = {
  id: string;
  title: string;
  questionCount: number;
  estimatedMinutes: number;
};

type InProgressQuiz = {
  id: string;
  title: string;
  answered: number;
  total: number;
};

export function useHomeData() {
  const { session } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [inProgressQuiz, setInProgressQuiz] = useState<InProgressQuiz | null>(null);
  const [suggestedQuizzes, setSuggestedQuizzes] = useState<SuggestedQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);

    const userId = session.user.id;

    const [{ data: student }, { data: quizzes }, { data: questions }, { data: answers }, { data: results }] =
      await Promise.all([
        supabase.from('students').select('name').eq('id', userId).single(),
        supabase.from('quizzes').select('id, target_type, target_id'),
        supabase.from('questions').select('id, quiz_id'),
        supabase.from('user_answers').select('quiz_id, question_id').eq('user_id', userId),
        supabase.from('user_results').select('quiz_id').eq('user_id', userId),
      ]);

    setStudentName(student?.name ?? '');

    const allQuizzes = quizzes ?? [];
    const allQuestions = questions ?? [];
    const allAnswers = answers ?? [];
    const completedQuizIds = new Set((results ?? []).map((r) => r.quiz_id));

    const questionsByQuiz = groupBy(allQuestions, (q) => q.quiz_id);
    const answersByQuiz = groupBy(allAnswers, (a) => a.quiz_id);

    const inProgress = allQuizzes.find((q) => {
      const answered = answersByQuiz[q.id]?.length ?? 0;
      return answered > 0 && !completedQuizIds.has(q.id);
    });

    if (inProgress) {
      const title = await resolveTargetName(inProgress.target_type, inProgress.target_id);
      setInProgressQuiz({
        id: inProgress.id,
        title,
        answered: new Set(answersByQuiz[inProgress.id]?.map((a) => a.question_id)).size,
        total: questionsByQuiz[inProgress.id]?.length ?? 0,
      });
    } else {
      setInProgressQuiz(null);
    }

    const suggestions = allQuizzes
      .filter((q) => !completedQuizIds.has(q.id) && q.id !== inProgress?.id)
      .slice(0, 3);

    const resolved = await Promise.all(
      suggestions.map(async (q) => ({
        id: q.id,
        title: await resolveTargetName(q.target_type, q.target_id),
        questionCount: questionsByQuiz[q.id]?.length ?? 0,
        estimatedMinutes: estimateMinutes(questionsByQuiz[q.id]?.length ?? 0),
      })),
    );
    setSuggestedQuizzes(resolved);

    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return { studentName, inProgressQuiz, suggestedQuizzes, loading };
}

async function resolveTargetName(targetType: 'course' | 'area', targetId: string | null): Promise<string> {
  if (!targetId) return 'Teste geral';
  if (targetType === 'course') {
    const { data } = await supabase.from('courses').select('name').eq('id', targetId).single();
    return data?.name ?? 'Curso';
  }
  const { data } = await supabase.from('course_areas').select('name').eq('id', targetId).single();
  return data?.name ?? 'Área';
}

function estimateMinutes(questionCount: number): number {
  return Math.max(1, Math.round(questionCount * 0.5));
}

function groupBy<T, K extends string>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}