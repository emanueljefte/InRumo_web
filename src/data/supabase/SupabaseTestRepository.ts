import { supabase } from '../../api/supabase';
import type { TestRepository, SaveTestResultInput } from '../../domain/test/TestRepository';

export class SupabaseTestRepository implements TestRepository {
  async saveResult(input: SaveTestResultInput): Promise<void> {
    const { error } = await supabase.from('test_results').insert({
      user_id: input.userId,
      recommended_course_id: input.recommendedCourseId,
      is_tie: input.isTie,
      runner_up_course_id: input.runnerUpCourseId,
      all_scores: input.allScores,
    });

    if (error) throw error;
  }

  async getResultHistory(userId: string): Promise<SaveTestResultInput[]> {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      userId: row.user_id,
      recommendedCourseId: row.recommended_course_id,
      isTie: row.is_tie,
      runnerUpCourseId: row.runner_up_course_id,
      allScores: row.all_scores,
    }));
  }
}