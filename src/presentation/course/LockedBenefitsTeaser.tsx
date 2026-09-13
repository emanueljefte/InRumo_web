import { Lock, Sparkles, ArrowRight, BookOpen, GraduationCap, Briefcase } from 'lucide-react';

interface LockedBenefitsTeaserProps {
  onRegister: () => void;
}

export function LockedBenefitsTeaser({ onRegister }: LockedBenefitsTeaserProps) {
  return (
    <div className="mt-10 pt-8 border-t border-outline-variant/40">
      <div className="relative bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 sm:p-10 text-center overflow-hidden shadow-xs">
        
        {/* Iluminação suave e padrão de fundo em gradiente */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-surface-container-lowest pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto space-y-5">
          
          {/* Badge & Ícone com container estilizado */}
          <div className="inline-flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          {/* Título e Descrição */}
          <div className="space-y-2">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Desbloqueie o Conteúdo Completo
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              A grade curricular detalhada e as orientações avançadas ficam disponíveis quando este for um dos teus cursos recomendados.
            </p>
          </div>

          {/* Preview dos Benefícios Bloqueados (Pills) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 pb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-[11px] font-semibold text-on-surface-variant">
              <BookOpen size={12} className="text-primary" /> Grade Curricular
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-[11px] font-semibold text-on-surface-variant">
              <Briefcase size={12} className="text-primary" /> Mercado de Trabalho
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-[11px] font-semibold text-on-surface-variant">
              <GraduationCap size={12} className="text-primary" /> Plano Vocacional
            </span>
          </div>

          {/* Botão de Ação Primária */}
          <div className="pt-2">
            <button
              onClick={onRegister}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-bold px-7 py-3.5 rounded-2xl text-xs sm:text-sm hover:opacity-95 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Fazer o Teste Vocacional</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}