import { Compass, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

interface TakeTestPromptCardProps {
  onStart: () => void;
}

export function TakeTestPromptCard({ onStart }: TakeTestPromptCardProps) {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-primary-container/15 rounded-3xl border border-outline-variant/60 p-6 sm:p-8 space-y-5 shadow-xs transition-all hover:shadow-md">
      
      {/* Topo / Badge e Ícone */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-primary/20">
          <Compass className="w-3.5 h-3.5" />
          <span>Diagnóstico Vocacional</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-on-surface-variant/80">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>Aprox. 5 min</span>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-2 max-w-xl">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Descobre o teu perfil académico
        </h2>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Responde a 18 perguntas rápidas e interativas para descobrires qual dos nossos cursos de engenharia e tecnologia mais combina contigo.
        </p>
      </div>

      {/* Pontos de Destaque Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-medium text-on-surface-variant">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>Resultado imediato e detalhado</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>Recomendações de cursos do INSTIC</span>
        </div>
      </div>

      {/* Ação Principal */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-7 py-3.5 rounded-2xl transition-all shadow-xs hover:shadow-primary/20 cursor-pointer group"
        >
          <span>Começar teste agora</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

    </div>
  );
}