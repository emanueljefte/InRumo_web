import { Clock } from "lucide-react";

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-4 text-center">
        <Clock className="w-8 h-8 text-primary mx-auto" />
        <h1 className="font-heading text-headline-md text-on-surface">Conta em análise</h1>
        <p className="font-body-sm text-on-surface-variant">
          O teu comprovativo de matrícula está a ser analisado pela Administração Académica.
          Vais receber um email assim que a tua conta for validada.
        </p>
      </div>
    </div>
  );
}