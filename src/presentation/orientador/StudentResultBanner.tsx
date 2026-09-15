import { useEffect, useState } from 'react';
import { Sparkles, Trophy, GitMerge } from 'lucide-react';
import { supabase } from '../../api/supabase';
import { AREAS } from '../../domain/test/Area';
import type { AreaId } from '../../domain/test/Area';

type ResultInfo = {
  recommendedAreaId: AreaId;
  isTie: boolean;
  runnerUpAreaId: AreaId | null;
  allScores: { areaId: AreaId; percentage: number }[];
};

export function StudentResultBanner({ userId }: { userId: string }) {
  const [result, setResult] = useState<ResultInfo | null>(null);
  // 1. Inicia logo como true para evitar setState síncrono no inicio do effect
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchResult() {
      try {
        const { data } = await supabase
          .from('test_results')
          .select('recommended_area_id, is_tie, runner_up_area_id, all_scores')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (isMounted) {
          setResult(
            data
              ? {
                  recommendedAreaId: data.recommended_area_id,
                  isTie: data.is_tie,
                  runnerUpAreaId: data.runner_up_area_id,
                  allScores: data.all_scores ?? [],
                }
              : null
          );
        }
      } catch (error) {
        console.error('Erro ao carregar resultados:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading || !result?.recommendedAreaId) return null;

  const topScore =
    result.allScores.find((s) => s.areaId === result.recommendedAreaId)?.percentage ?? 0;

  const tiedAreas = result.isTie
    ? result.allScores.filter((s) => Math.abs(s.percentage - topScore) <= 3)
    : [{ areaId: result.recommendedAreaId, percentage: topScore }];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-tertiary-container/30 via-surface-container-lowest/80 to-tertiary-container/10 backdrop-blur-md border border-tertiary/25 rounded-2xl p-3.5 mb-4 shadow-sm transition-all duration-300">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-tertiary/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-1.5 text-tertiary font-heading">
          {result.isTie ? (
            <GitMerge className="w-4 h-4 text-tertiary shrink-0 animate-pulse" />
          ) : (
            <Trophy className="w-4 h-4 text-tertiary shrink-0" />
          )}
          <span className="text-xs font-bold tracking-tight uppercase">
            {result.isTie ? `Empate Técnico (${tiedAreas.length} Áreas)` : 'Área Recomendada'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tiedAreas.map((s, index) => {
            const areaInfo = AREAS[s.areaId];
            const isFirst = index === 0;

            return (
              <div
                key={s.areaId}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  isFirst && !result.isTie
                    ? 'bg-gradient-to-r from-tertiary to-tertiary/90 text-on-tertiary border-tertiary/80 shadow-xs shadow-tertiary/20'
                    : 'bg-surface-container-lowest/90 text-on-surface border-outline-variant/30 hover:border-tertiary/40'
                }`}
              >
                {isFirst && !result.isTie && <Sparkles size={12} className="text-on-tertiary animate-spin" />}
                <span>{areaInfo?.nome ?? s.areaId}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isFirst && !result.isTie
                      ? 'bg-on-tertiary/20 text-on-tertiary'
                      : 'bg-tertiary-container/40 text-tertiary'
                  }`}
                >
                  {Math.round(s.percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}