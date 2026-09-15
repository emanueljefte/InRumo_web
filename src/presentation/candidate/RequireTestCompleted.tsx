import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestResult } from '../../application/test/useTestResult';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { Sparkles, ArrowLeft, ClipboardList } from 'lucide-react';

export function RequireTestCompleted({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const { result, loading } = useTestResult(testRepository);

  // 1. Apenas consideramos o estado "pronto" quando o loading do repositório/hook
  // for explicitamente false E a verificação do objeto result tiver ocorrido (mesmo que null)
  const isReady = !loading && result !== undefined;

  // Enquanto estiver carregando ou na transição cega dos milissegundos iniciais, exibe o Skeleton Screen
  if (!isReady) {
    return (
      <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 space-y-6 animate-fadeIn">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 bg-surface-container-high rounded-full animate-pulse" />
              <div className="h-3.5 w-72 bg-surface-container-high rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="h-24 w-full bg-surface-container-high rounded-2xl animate-pulse" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-10 w-28 bg-surface-container-high rounded-xl animate-pulse" />
            <div className="h-10 w-36 bg-surface-container-high rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Apenas se o carregamento estiver totalmente CONCLUÍDO e for confirmado
  // que NÃO existe curso recomendado, renderizamos o Card Bloqueado.
  if (!result?.recommendedCourseId) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4 py-12 animate-fadeIn">
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center sm:text-left">
          
          {/* Ícone e Título */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-on-surface">
                Teste Vocacional Necessário
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Para ter acesso à assistência do Orientador IA, você precisa realizar o teste vocacional primeiro.
              </p>
            </div>
          </div>

          {/* Mensagem Explicativa */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            O Orientador IA utiliza o resultado das suas aptidões e o curso recomendado no teste para personalizar as orientações de carreira acadêmica no INSTIC.
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-xl border border-outline-variant/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/test')}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold bg-primary text-on-primary rounded-2xl hover:opacity-95 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Realizar Teste Agora</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 3. Só chega aqui quando o result.recommendedCourseId for confirmado e válido
  return <>{children}</>;
}