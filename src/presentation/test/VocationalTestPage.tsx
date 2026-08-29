import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { clearTestSession, loadOrCreateTestSession, saveTestSession, SESSION_KEY, type TestSession } from '../../application/test/testSession';
import gsap from 'gsap';


export default function VocationalTestPage() {
    const navigate = useNavigate();
    const [session, setSession] = useState<TestSession>(() => loadOrCreateTestSession());
    const [showExitConfirm, setShowExitConfirm] = useState(false)

    const questions = session.questions;
    const totalQuestions = questions.length;
    const currentQuestion = questions[session.currentIndex];
    const selectedScore = session.answers[currentQuestion.id] ?? null;
    const progressPercentage = ((session.currentIndex + 1) / totalQuestions) * 100;

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) {
            const s: TestSession = JSON.parse(raw);
            if (s.currentIndex > 0) {
                // mostra um toast/banner: "Retomámos o teu progresso — estás na pergunta X"
            }
        }
    }, []);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
    }, [session.currentIndex]);


    const handleScoreSelect = useCallback((score: number) => {
        const updated = { ...session, answers: { ...session.answers, [currentQuestion.id]: score } };
        setSession(updated);
        saveTestSession(updated);
    }, [session, currentQuestion.id]);

    const handleNext = useCallback(() => {
        if (selectedScore === null) return;

        if (session.currentIndex < questions.length - 1) {
            const updated = { ...session, currentIndex: session.currentIndex + 1 };
            setSession(updated);
            saveTestSession(updated);
        } else {
            sessionStorage.setItem('vocational_test_answers', JSON.stringify(session.answers));
            clearTestSession();
            navigate('/results');
        }
    }, [session, selectedScore, questions.length, navigate]);

    const handlePrev = () => {
        if (session.currentIndex > 0) {
            const updated = { ...session, currentIndex: session.currentIndex - 1 };
            setSession(updated);
            saveTestSession(updated);
        } else {
            navigate(-1);
        }
    };

    // atalhos de teclado — modo zen: responder sem tocar no rato
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['1', '2', '3', '4', '5'].includes(e.key)) {
                handleScoreSelect(Number(e.key));
            }
            if (e.key === 'Enter' && selectedScore !== null) {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedScore, session.currentIndex, handleNext, handleScoreSelect]);

    const handleExit = () => setShowExitConfirm(true);

    return (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 font-body antialiased text-on-background">

            {/* Botão de Sair Superior */}
            <div className="w-full max-w-200 flex justify-end mb-4">
                <button
                    type="button"
                    onClick={handleExit}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#504536] hover:text-on-background transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container"
                >
                    <X className="w-4 h-4" />
                    Sair
                </button>
            </div>

            {/* Cartão do Teste Vocacional */}
            <div ref={cardRef} className="w-full max-w-200 bg-white rounded-3xl border border-surface-container-high p-6 sm:p-10 md:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-10 my-auto">

                {/* Cabeçalho do Teste */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold tracking-wider text-outline">
                        <span className="uppercase text-[11px] font-heading text-on-background">
                            {currentQuestion.category}
                        </span>
                        <span className="font-normal">
                            Pergunta {session.currentIndex + 1} de {totalQuestions}
                        </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Pergunta Principal */}
                <div className="py-2">
                    <h1 className="font-heading text-2xl sm:text-3xl md:text-[32px] md:leading-10.5 font-bold text-on-background tracking-tight">
                        {currentQuestion.statement}
                    </h1>
                </div>

                {/* Escala de Seleção (1 a 5) */}
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
                                    <button
                                        type="button"
                                        onClick={() => handleScoreSelect(score)}
                                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-heading text-lg sm:text-xl font-bold transition-all duration-200 ${isSelected
                                            ? 'bg-primary text-white ring-4 ring-[#fbf5e8] scale-105 shadow-sm'
                                            : 'bg-white border border-[#d4c4b0]/70 text-on-background hover:border-[#7e5700] hover:bg-[#fbf5e8]/50'
                                            }`}
                                    >
                                        {score}
                                    </button>

                                    {label && (
                                        <span className="text-[11px] sm:text-xs text-outline text-center leading-tight font-medium max-w-20">
                                            {label}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Rodapé: Botões Voltar & Próximo */}
                <div className="pt-6 border-t border-surface-container-high flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-background border border-[#d4c4b0]/80 bg-white hover:bg-[#f4f2fd] py-3 px-6 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={selectedScore === null}
                        className="bg-primary hover:bg-[#604100] disabled:cursor-not-allowed active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-xs transition-all duration-150 flex items-center gap-2"
                    >
                        Próximo
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>

            </div>

            {showExitConfirm && (
                <div className="fixed inset-0 z-60 bg-on-surface/40 flex items-center justify-center p-4">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full space-y-4">
                        <p className="font-heading text-headline-sm text-on-surface">Sair do teste?</p>
                        <p className="font-body-sm text-on-surface-variant">Vais perder o progresso feito até agora.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowExitConfirm(false)} className="px-4 py-2 text-sm font-medium">
                                Continuar teste
                            </button>
                            <button
                                onClick={() => { clearTestSession(); navigate('/landingpage'); }} // descarta de vez
                                className="px-4 py-2 text-sm font-medium text-error"
                            >
                                Sair e descartar
                            </button>
                            <button
                                onClick={() => navigate('/landingpage')} // sessão fica guardada, retoma depois
                                className="px-4 py-2 text-sm font-semibold bg-primary-container text-on-primary-container rounded-lg"
                            >
                                Sair e guardar progresso
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}