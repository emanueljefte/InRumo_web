import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { calculateQuizResult } from './matching';
import type { QuestionWeightMap, SingleChoiceWeightMap } from './types';

type QuestionForScoring = { id: string; type: 'single_choice' | 'multi_choice' | 'scale'; weightMap: QuestionWeightMap };
type QuestionOption = { id: string; label: string };
type RunnerQuestion = { id: string; text: string; type: 'single_choice' | 'multi_choice' | 'scale'; options: QuestionOption[] };

export function useQuizRunner(quizId: string | undefined) {
  const { session } = useAuth();
  const [allQuestions, setAllQuestions] = useState<RunnerQuestion[]>([]);
  const [rawQuestions, setRawQuestions] = useState<QuestionForScoring[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});
  const [finishing, setFinishing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId || !session?.user) return;

    (async () => {
      setLoading(true);
      const { data: rows } = await supabase
        .from('questions')
        .select('id, text, type, weight_map')
        .eq('quiz_id', quizId)
        .order('order');

      const questions = (rows ?? []).map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type as RunnerQuestion['type'],
        weightMap: q.weight_map as QuestionWeightMap,
      }));

      setRawQuestions(questions.map((q) => ({ id: q.id, type: q.type, weightMap: q.weightMap })));

      const parsed: RunnerQuestion[] = questions.map((q) => {
        if (q.type === 'scale') return { id: q.id, text: q.text, type: q.type, options: [] };
        const optionMap = q.weightMap as SingleChoiceWeightMap;
        return {
          id: q.id,
          text: q.text,
          type: q.type,
          options: Object.entries(optionMap).map(([id, opt]) => ({ id, label: opt.label })),
        };
      });
      setAllQuestions(parsed);

      const { data: existing } = await supabase
        .from('user_answers')
        .select('question_id, answer')
        .eq('quiz_id', quizId)
        .eq('user_id', session.user.id);

      const answered: Record<string, string[]> = {};
      (existing ?? []).forEach((a) => { answered[a.question_id] = a.answer; });
      setAnswersMap(answered);

      const firstUnanswered = parsed.findIndex((q) => !answered[q.id]);
      setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
      setLoading(false);
    })();
  }, [quizId, session?.user?.id]);

  const question = allQuestions[currentIndex] ?? null;
  const selectedOptionIds = question ? (answersMap[question.id] ?? []) : [];

  const selectOption = useCallback((optionId: string, type: RunnerQuestion['type']) => {
    if (!question) return;
    setAnswersMap((prev) => {
      const current = prev[question.id] ?? [];
      if (type === 'multi_choice') {
        const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  }, [question]);

  const persistCurrentAnswer = useCallback(async () => {
    if (!question || !session?.user || !quizId) return;
    const answer = answersMap[question.id] ?? [];

    await supabase.from('user_answers').upsert({
      user_id: session.user.id,
      quiz_id: quizId,
      question_id: question.id,
      answer,
      answered_at: new Date().toISOString(),
    }, { onConflict: 'user_id,question_id' });
  }, [question, answersMap, quizId, session?.user?.id]);

  const isLastQuestion = currentIndex === allQuestions.length - 1;

  const goNext = useCallback(async (): Promise<string | undefined> => {
    await persistCurrentAnswer();

    if (isLastQuestion) {
      setFinishing(true);
      const result = calculateQuizResult(rawQuestions, answersMap);

      const { data: inserted } = await supabase
        .from('user_results')
        .insert({
          user_id: session!.user.id,
          quiz_id: quizId,
          scores: result.scores,
          top_matches: result.topMatches,
        })
        .select('id')
        .single();

      setFinishing(false);
      return inserted?.id;
    }

    setCurrentIndex((i) => i + 1);
    return undefined;
  }, [persistCurrentAnswer, isLastQuestion, rawQuestions, answersMap, quizId, session]);

  const goBack = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);

  return { question, currentIndex, total: allQuestions.length, selectedOptionIds, selectOption, goNext, goBack, isLastQuestion, finishing, loading };
}