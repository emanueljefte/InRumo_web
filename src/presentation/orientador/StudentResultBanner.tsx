import { useEffect, useState } from 'react';
import { Sparkles, Trophy, GitMerge, Award, } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Efeito sutil de brilho no canto superior */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5">
          {/* Tag de Cabeçalho */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                result.isTie
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {result.isTie ? (
                <>
                  <GitMerge className="w-3.5 h-3.5 text-amber-600" />
                  Empate Técnico ({tiedAreas.length} Áreas)
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5 text-indigo-600" />
                  Área Recomendada
                </>
              )}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {result.isTie ? 'Afinidade equiparada' : 'Maior compatibilidade vocacional'}
            </span>
          </div>

          {/* Lista de Áreas Recomendadas / Em Empate */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {tiedAreas.map((s, index) => {
              const areaInfo = AREAS[s.areaId];
              const isFirst = index === 0;

              return (
                <div
                  key={s.areaId}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 ${
                    isFirst && !result.isTie
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/20'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isFirst && !result.isTie && (
                    <Sparkles size={14} className="text-indigo-200 animate-pulse" />
                  )}
                  <span>{areaInfo?.nome ?? s.areaId}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isFirst && !result.isTie
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {Math.round(s.percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ícone ou Indicador Lateral para Destaque */}
        <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all shrink-0">
          <Award size={20} />
        </div>
      </div>
    </div>
  );
}