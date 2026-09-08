// presentation/test/MatriculadoTestPage.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import {
  clearMatriculadoSession,
  loadOrCreateMatriculadoSession,
  saveMatriculadoSession,
  type MatriculadoTestSession,
} from '../../application/test/matriculadoTestSession';
import { calculateAreaResult } from '../../application/test/calculateAreaResult';
import type { CourseId } from '../../domain/test/TestQuestion';

export default function MatriculadoTestPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<MatriculadoTestSession>(() =>
    loadOrCreateMatriculadoSession(profile!.cursoId as CourseId)
  );

  const questions = session.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[session.currentIndex];
  const selectedScore = session.answers[currentQuestion.id] ?? null;
  const progressPercentage = ((session.currentIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }, [session.currentIndex]);

  const handleScoreSelect = useCallback((score: number) => {
    const updated = { ...session, answers: { ...session.answers, [currentQuestion.id]: score } };
    setSession(updated);
    saveMatriculadoSession(updated);
  }, [session, currentQuestion.id]);

  const handleNext = useCallback(() => {
    if (selectedScore === null) return;

    if (session.currentIndex < questions.length - 1) {
      const updated = { ...session, currentIndex: session.currentIndex + 1 };
      setSession(updated);
      saveMatriculadoSession(updated);
    } else {
      const result = calculateAreaResult(session.answers, session.cursoId);
      sessionStorage.setItem('matriculado_test_result', JSON.stringify(result));
      clearMatriculadoSession();
      navigate('/student/results');
    }
  }, [session, selectedScore, questions.length, navigate]);

  const handlePrev = useCallback(() => {
    if (session.currentIndex > 0) {
      const updated = { ...session, currentIndex: session.currentIndex - 1 };
      setSession(updated);
      saveMatriculadoSession(updated);
    } else {
      navigate(-1);
    }
  }, [session, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) handleScoreSelect(Number(e.key));
      if (e.key === 'Enter' && selectedScore !== null) handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScore, handleScoreSelect, handleNext]);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-body antialiased text-on-background">
      <div className="w-full max-w-200 flex justify-end mb-4">
        <button type="button" onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-outline hover:text-on-background transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container">
          <X className="w-4 h-4" /> Sair
        </button>
      </div>

      <div ref={cardRef} className="w-full max-w-200 bg-white rounded-3xl border border-surface-container-high p-6 sm:p-10 md:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-10 my-auto">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold tracking-wider text-outline">
            <span className="uppercase text-[11px] font-heading text-on-background">{currentQuestion.categoria}</span>
            <span className="font-normal">Pergunta {session.currentIndex + 1} de {totalQuestions}</span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl md:text-[32px] md:leading-10.5 font-bold text-on-background tracking-tight">
          {currentQuestion.enunciado}
        </h1>

        <div className="py-4">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-150 mx-auto items-start">
            {[1, 2, 3, 4, 5].map((score) => {
              const isSelected = selectedScore === score;
              let label = '';
              if (score === 1) label = 'Nada a ver comigo';
              if (score === 3) label = 'Neutro';
              if (score === 5) label = 'Muito a ver comigo';
              return (
                <div key={score} className="flex flex-col items-center gap-3">
                  <button type="button" onClick={() => handleScoreSelect(score)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-heading text-lg sm:text-xl font-bold transition-all duration-200 ${
                      isSelected ? 'bg-primary text-white ring-4 ring-primary-container/40 scale-105 shadow-sm' : 'bg-white border border-outline-variant text-on-background hover:border-primary hover:bg-primary-container/10'
                    }`}>
                    {score}
                  </button>
                  {label && <span className="text-[11px] sm:text-xs text-outline text-center leading-tight font-medium max-w-20">{label}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container-high flex items-center justify-between">
          <button type="button" onClick={handlePrev}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-background border border-outline-variant bg-white hover:bg-surface-container py-3 px-6 rounded-xl transition-all">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button type="button" onClick={handleNext} disabled={selectedScore === null}
            className="bg-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2">
            Próximo <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 z-60 bg-on-surface/40 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full space-y-4">
            <p className="font-heading text-headline-sm text-on-surface">Sair do teste?</p>
            <p className="font-body-sm text-on-surface-variant">Vais perder o progresso feito até agora.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowExitConfirm(false)} className="px-4 py-2 text-sm font-medium">Continuar teste</button>
              <button onClick={() => { clearMatriculadoSession(); navigate('/student'); }} className="px-4 py-2 text-sm font-medium text-error">Sair e descartar</button>
              <button onClick={() => navigate('/student')} className="px-4 py-2 text-sm font-semibold bg-primary-container text-on-primary-container rounded-lg">Sair e guardar progresso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}