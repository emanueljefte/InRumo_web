import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  MessageCircle,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { AREAS } from '../../domain/test/Area';
import type { AreaTestResult } from '../../domain/test/AreaScore';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { isAreaTie } from '../../application/test/calculateAreaResult';

function readAreaResult(): AreaTestResult | null {
  try {
    const raw = sessionStorage.getItem('matriculado_test_result');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function MatriculadoResultsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  
  const [result] = useState<AreaTestResult | null>(() => readAreaResult());
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Ref para garantir que a persistência só seja executada uma vez por sessão/resultado
  const hasAttemptedSave = useRef(false);

  useEffect(() => {
    const userId = session?.user?.id;

    // Se não houver resultado, utilizador ou se já executamos a gravação, ignora
    if (!result || !userId || hasAttemptedSave.current) return;

    let isMounted = true;
    hasAttemptedSave.current = true;

    async function persistResult() {
      setStatus('saving');
      
      try {
        await testRepository.saveResult({
          userId: userId!,
          recommendedAreaId: result!.recommended.areaId,
          isTie: isAreaTie(result!),
          runnerUpAreaId: result!.runnerUp?.areaId ?? null,
          allScores: result!.allScores.map((s) => ({
            areaId: s.areaId,
            percentage: s.percentage
          })),
        });

        if (isMounted) {
          setStatus('saved');
          setSaveError(null);
        }
      } catch (err) {
        console.error('Erro ao guardar resultado:', err);
        if (isMounted) {
          setStatus('error');
          setSaveError('Não foi possível sincronizar o resultado. Os teus dados locais permanecem salvos.');
        }
      }
    }

    persistResult();

    return () => {
      isMounted = false;
    };
  }, [result, session?.user?.id, testRepository]);

  // Ecrã de Sem Resultado
  if (!result) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-12 px-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-on-surface">
            Nenhum resultado encontrado
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Ainda não concluíste a tua avaliação vocacional para determinar a área de especialização ideal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/tests')}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer"
        >
          <span>Realizar Teste Vocacional</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const isTie = isAreaTie(result);
  const recommendedArea = AREAS[result.recommended.areaId];
  const runnerUpArea = result.runnerUp ? AREAS[result.runnerUp.areaId] : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 animate-fadeIn">
      
      {/* Alerta de erro na sincronização */}
      {saveError && (
        <div className="p-3.5 rounded-2xl bg-warning/10 border border-warning/20 text-xs font-semibold text-warning flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Cartão Principal do Resultado */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Efeito Glow no fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badges Superiores */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Especialização Recomendada
          </span>

          {status === 'saving' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              A guardar...
            </span>
          )}

          {status === 'saved' && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
            </span>
          )}
        </div>

        {/* Nome da Área e Percentagem */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
              {recommendedArea.nome}
            </h1>
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-primary shrink-0">
              {Math.round(result.recommended.percentage)}%
            </span>
          </div>

          <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {recommendedArea.descricao || 'Esta área alinha-se com o teu perfil de resolução de problemas e interesses de desenvolvimento de carreira.'}
          </p>
        </div>

        {/* Banner de Empate Técnico (se houver) */}
        {isTie && runnerUpArea && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
              <Award className="w-4 h-4" />
              <span>Empate Técnico Detetado</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Exibes uma afinidade quase idêntica com <strong className="text-on-surface">{runnerUpArea.nome}</strong> ({Math.round(result.runnerUp?.percentage || 0)}%). Ambas são excelentes opções para a tua trajetória.
            </p>
          </div>
        )}

        {/* Gráfico / Barras de Progresso de Todas as Áreas */}
        <div className="pt-6 border-t border-outline-variant/40 space-y-4">
          <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Detalhamento de Compatibilidade
          </h2>

          <div className="space-y-3">
            {result.allScores.map((score) => {
              const area = AREAS[score.areaId];
              const isTop = score.areaId === result.recommended.areaId;

              return (
                <div key={score.areaId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className={isTop ? 'text-primary font-bold' : 'text-on-surface-variant'}>
                      {area.nome}
                    </span>
                    <span className={isTop ? 'text-primary font-bold' : 'text-on-surface-variant'}>
                      {Math.round(score.percentage)}%
                    </span>
                  </div>

                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTop ? 'bg-primary' : 'bg-border'
                      }`}
                      style={{ width: `${Math.max(score.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discutir Resultado com o Orientador</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/tests')}
            className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm px-6 py-3 rounded-2xl transition-all border border-outline-variant/40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-on-surface-variant" />
            <span>Refazer Avaliação</span>
          </button>
        </div>

      </div>
    </div>
  );
}