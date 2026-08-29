import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { MessageCircle, Home } from 'lucide-react';
import { useQuizResultDetail } from '../../features/results/useQuizResultDetail';

export default function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { result, loading } = useQuizResultDetail(id);
  const contentRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !result) return;

    gsap.fromTo(contentRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });

    if (barsRef.current) {
      const fills = barsRef.current.querySelectorAll('.bar-fill');
      gsap.fromTo(
        fills,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, stagger: 0.08, delay: 0.2, ease: 'power2.out', transformOrigin: 'left' },
      );
    }
  }, [loading, result]);

  if (loading || !result) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxScore = Math.max(...result.matches.map((m) => m.score), 1);

  return (
    <div className="max-w-xl mx-auto">
      <div ref={contentRef}>
        <p className="text-primary text-xs font-heading mb-1">Resultado</p>
        <h1 className="font-heading text-2xl text-text mb-2">{result.quizTitle}</h1>

        {result.isAmbiguous ? (
          <p className="text-textMuted text-sm mb-8 leading-relaxed">
            Ficaste entre algumas opções próximas — vale conversar com a orientadora.
          </p>
        ) : (
          <p className="text-textMuted text-sm mb-8 leading-relaxed">
            Tua maior afinidade é com {result.matches[0]?.name}.
          </p>
        )}

        <div ref={barsRef} className="flex flex-col gap-3 mb-10">
          {result.matches.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="text-textMuted text-xs w-32 truncate">{m.name}</span>
              <div className="flex-1 h-3 bg-surface border border-border rounded-full overflow-hidden">
                <div
                  className={`bar-fill h-full rounded-full ${m.isTopMatch ? 'bg-primary' : 'bg-textMuted/40'}`}
                  style={{ width: `${(m.score / maxScore) * 100}%` }}
                />
              </div>
              <span className="text-text text-xs w-10 text-right">{m.score}%</span>
            </div>
          ))}
        </div>

        {result.isAmbiguous && (
          <button
            onClick={() => navigate('/chat')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-heading rounded-md py-3 mb-3 hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={16} />
            Falar com orientadora
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 text-text text-sm py-3 hover:text-primary transition-colors"
        >
          <Home size={16} />
          Voltar ao início
        </button>
      </div>
    </div>
  );
}