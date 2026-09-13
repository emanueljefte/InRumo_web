// presentation/test/TestFormatSelectionPage.tsx
import { useNavigate } from 'react-router-dom';
import { CheckSquare, MessageSquareText, ListOrdered, Heart, Shuffle } from 'lucide-react';
import type { QuestionType } from '../../domain/test/MatriculadoQuestion';

const FORMAT_OPTIONS: { types: QuestionType[] | null; label: string; desc: string; icon: typeof CheckSquare }[] = [
  { types: null, label: 'Misto (recomendado)', desc: 'Combina todos os formatos — mais completo e dinâmico.', icon: Shuffle },
  { types: ['likert'], label: 'Escala clássica', desc: 'Concordo/discordo com afirmações, de 1 a 5.', icon: CheckSquare },
  { types: ['scenario'], label: 'Cenários', desc: 'Escolhe o que farias em situações reais.', icon: MessageSquareText },
  { types: ['ranking'], label: 'Ordenar preferências', desc: 'Ordena actividades da que mais gostas para a que menos.', icon: ListOrdered },
  { types: ['swipe'], label: 'Swipe rápido', desc: 'Desliza para concordar ou discordar, ao estilo de um jogo.', icon: Heart },
];

export default function TestFormatSelectionPage() {
  const navigate = useNavigate();

  const handleSelect = (types: QuestionType[] | null) => {
    sessionStorage.setItem('matriculado_test_format', JSON.stringify(types));
    navigate('/student/test');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 py-10">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-headline-lg text-on-surface">Como preferes fazer o teste?</h1>
        <p className="font-body-sm text-on-surface-variant">Todos os formatos dão um resultado igualmente válido.</p>
      </div>

      <div className="space-y-3">
        {FORMAT_OPTIONS.map((opt) => (
          <button key={opt.label} onClick={() => handleSelect(opt.types)}
            className="w-full flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 text-left hover:border-primary transition-all">
            <div className="w-11 h-11 rounded-lg bg-primary-container/60 flex items-center justify-center text-on-primary-container shrink-0">
              <opt.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body-md font-semibold text-on-surface">{opt.label}</p>
              <p className="font-body-sm text-xs text-on-surface-variant">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}