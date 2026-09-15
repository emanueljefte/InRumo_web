import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase';
import { AREAS } from '../../domain/test/Area';
import type { AreaId } from '../../domain/test/Area';

export function StudentResultBanner({ userId }: { userId: string }) {
  const [result, setResult] = useState<{ recommendedAreaId?: AreaId } | null>(null);

  useEffect(() => {
    supabase
      .from('test_results')
      .select('recommended_area_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setResult(data ? { recommendedAreaId: data.recommended_area_id } : null));
  }, [userId]);

  if (!result?.recommendedAreaId) return null;

  return (
    <div className="bg-tertiary-container/20 border border-tertiary/30 rounded-xl px-4 py-2.5 mb-3 flex items-center gap-2">
      <span className="text-xs font-semibold text-tertiary">Área recomendada:</span>
      <span className="text-xs text-on-surface">{AREAS[result.recommendedAreaId].nome}</span>
    </div>
  );
}