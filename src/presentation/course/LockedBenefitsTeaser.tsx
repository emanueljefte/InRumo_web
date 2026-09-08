import { ArrowRight, Lock } from "lucide-react";

export function LockedBenefitsTeaser({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="mt-10 pt-8 border-t border-[#e8e7f1] font-body text-[#1a1b22] antialiased">
      <div className="relative bg-white border border-[#e8e7f1] rounded-3xl p-8 sm:p-10 text-center overflow-hidden shadow-xs">
        
        {/* Glow de fundo decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-2xl pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-4 max-w-md mx-auto">
          {/* Ícone com destaque */}
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-5 h-5" />
          </div>

          {/* Título e Texto */}
          <div className="space-y-1.5">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1a1b22] tracking-tight">
              Vê saídas profissionais e testemunhos
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
              Cria uma conta gratuita para desbloquear o conteúdo completo deste curso.
            </p>
          </div>

          {/* Botão de Ação */}
          <div className="pt-2">
            <button
              onClick={onRegister}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 cursor-pointer group active:scale-95"
            >
              <span>Criar conta grátis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}