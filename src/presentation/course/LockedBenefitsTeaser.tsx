import { Lock } from "lucide-react";

export function LockedBenefitsTeaser({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="mt-10 pt-8 border-t border-outline-variant/50">
      <div className="relative bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/95 to-transparent" />
        <div className="relative space-y-3">
          <Lock className="w-6 h-6 text-primary mx-auto" />
          <h3 className="font-heading text-headline-sm text-on-surface">Vê saídas profissionais e testemunhos</h3>
          <p className="font-body-sm text-on-surface-variant max-w-sm mx-auto">
            Cria uma conta gratuita para desbloquear o conteúdo completo deste curso.
          </p>
          <button onClick={onRegister} className="bg-primary-container text-on-primary-container font-semibold px-6 py-3 rounded-xl">
            Criar conta grátis
          </button>
        </div>
      </div>
    </div>
  );
}