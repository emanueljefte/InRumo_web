import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function EnrollmentRejectedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-8 space-y-4 text-center">
        <XCircle className="w-8 h-8 text-error mx-auto" />
        <h1 className="font-heading text-headline-md text-on-surface">Matrícula não validada</h1>
        <p className="font-body-sm text-on-surface-variant">
          O teu comprovativo não foi aceite pela Administração Académica. Podes tentar novamente com um documento diferente, ou contactar a Administração para esclarecimentos.
        </p>
        <button onClick={() => navigate('/complete-enrollment')} className="w-full bg-primary-container text-on-primary-container font-semibold py-3 rounded-xl">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}