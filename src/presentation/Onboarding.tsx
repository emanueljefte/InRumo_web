import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Compass, ClipboardCheck, MessageCircle } from 'lucide-react';

const SLIDES = [
  { icon: Compass, title: 'Descubra seu curso ideal', description: 'Testes pensados pra te ajudar a escolher o curso ou área certa pra você.' },
  { icon: ClipboardCheck, title: 'Testes rápidos, resultado na hora', description: 'Responde no teu ritmo. O resultado é calculado assim que terminas.' },
  { icon: MessageCircle, title: 'Fale com uma orientadora quando precisar', description: 'Ficou em dúvida entre duas opções? Conversa com a orientadora pra decidir.' },
];

const ONBOARDING_KEY = 'onboarding_seen';

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const animateTo = (nextIndex: number) => {
    gsap.to(slideRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.2,
      onComplete: () => {
        setIndex(nextIndex);
        gsap.fromTo(slideRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
      },
    });
  };

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    navigate('/login');
  };

  const goNext = () => {
    if (index === SLIDES.length - 1) {
      finish();
      return;
    }
    animateTo(index + 1);
  };

  const isLast = index === SLIDES.length - 1;
  const Icon = SLIDES[index].icon;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      <button onClick={finish} className="absolute top-8 right-8 text-textMuted text-sm hover:text-text">
        Pular
      </button>

      <div ref={slideRef} className="flex flex-col items-center text-center max-w-md">
        <div className="w-22 h-22 rounded-full bg-surface border border-border flex items-center justify-center mb-6" style={{ width: 88, height: 88 }}>
          <Icon className="text-primary" size={40} />
        </div>
        <h1 className="font-heading text-2xl text-text mb-3">{SLIDES[index].title}</h1>
        <p className="text-textMuted text-sm leading-relaxed">{SLIDES[index].description}</p>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === index ? 'bg-primary w-5' : 'bg-border w-2'}`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          className="bg-primary text-white font-heading rounded-md px-8 py-3 hover:opacity-90 transition-opacity"
        >
          {isLast ? 'Começar' : 'Próximo'}
        </button>
      </div>
    </div>
  );
}