import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft, ArrowRight, Trash2, Save, Smile, Frown, Check } from 'lucide-react';
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

    // Suporte a Atalhos de Teclado (1 a 5, Setas)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (showExitConfirm) return;

            if (['1', '2', '3', '4', '5'].includes(e.key)) {
                handleScoreSelect(Number(e.key));
            } else if (e.key === 'ArrowRight' && selectedScore !== null) {
                handleNext();
            } else if (e.key === 'ArrowLeft' && session.currentIndex > 0) {
                handlePrev();
            }
            if (e.key === 'Enter' && selectedScore !== null) {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedScore, session.currentIndex, showExitConfirm]);

    const handleExit = () => setShowExitConfirm(true);

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 font-body antialiased text-on-surface selection:bg-primary-container selection:text-on-primary-container">

            {/* Barra Superior - Sair e Indicador de Progresso Geral */}
            <div className="w-full max-w-3xl flex items-center justify-between pt-2 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Sessão Ativa
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleExit}
                    className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors py-1.5 px-3 rounded-xl hover:bg-surface-container-high border border-transparent hover:border-outline-variant/60 cursor-pointer"
                >
                    <X className="w-4 h-4" />
                    <span>Sair</span>
                </button>
            </div>

            {/* Cartão do Teste Vocacional */}
            <div
                ref={cardRef}
                className="w-full max-w-3xl bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-10 md:p-12 shadow-xl space-y-8 my-auto relative transition-all duration-300"
            >
                {/* Cabeçalho do Teste */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold tracking-wider text-on-surface-variant">
                        <span className="uppercase text-[11px] font-heading font-semibold px-2.5 py-1 rounded-md bg-primary-container/40 text-on-primary-container border border-primary/10">
                            {currentQuestion.category || 'Aptidão Geral'}
                        </span>
                        <span className="font-medium text-on-surface-variant">
                            Pergunta <strong className="text-on-surface">{session.currentIndex + 1}</strong> de {totalQuestions}
                        </span>
                    </div>

                    {/* Barra de Progresso Interativa */}
                    <div className="relative w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Pergunta Principal */}
                <div className="py-2">
                    <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-on-surface tracking-tight leading-relaxed sm:leading-snug">
                        {currentQuestion.statement}
                    </h1>
                </div>

                {/* Escala de Seleção (1 a 5) */}
                <div className="py-4 space-y-3">
                    <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-xl mx-auto items-stretch">
                        {[1, 2, 3, 4, 5].map((score) => {
                            const isSelected = selectedScore === score;

                            return (
                                <div key={score} className="flex flex-col items-center gap-2.5 group">
                                    <button
                                        type="button"
                                        onClick={() => handleScoreSelect(score)}
                                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-heading text-lg sm:text-xl font-bold transition-all duration-200 cursor-pointer relative ${isSelected
                                                ? 'bg-primary text-on-primary ring-4 ring-primary/20 scale-105 shadow-md'
                                                : 'bg-surface-container-low border border-outline-variant/80 text-on-surface hover:border-primary/60 hover:bg-surface-container hover:scale-102'
                                            }`}
                                    >
                                        <span>{score}</span>
                                        {isSelected && (
                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rótulos Visuais Extremos */}
                    <div className="flex justify-between items-center max-w-xl mx-auto px-1 pt-1 text-[11px] sm:text-xs text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1 text-on-surface-variant/80">
                            <Frown className="w-3.5 h-3.5" /> Nada a ver comigo
                        </span>
                        <span className="hidden sm:block text-outline-variant">Neutro</span>
                        <span className="flex items-center gap-1 text-primary font-semibold">
                            Muito a ver comigo <Smile className="w-3.5 h-3.5 text-primary" />
                        </span>
                    </div>
                </div>

                {/* Rodapé: Botões Voltar & Próximo */}
                <div className="pt-6 border-t border-outline-variant/40 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={session.currentIndex === 0}
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-on-surface border border-outline-variant/80 bg-surface-container-lowest hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed py-3 px-5 sm:px-6 rounded-xl transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={selectedScore === null}
                        className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-on-surface-variant/40 disabled:cursor-not-allowed active:scale-[0.98] text-xs sm:text-sm font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-xs hover:bg-primary/90 transition-all duration-150 flex items-center gap-2 cursor-pointer"
                    >
                        <span>{session.currentIndex + 1 === totalQuestions ? 'Concluir Teste' : 'Próximo'}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>
            </div>

            {/* Dica de Teclado no Rodapé */}
            <div className="w-full max-w-3xl text-center pb-2 hidden sm:block">
                <p className="text-[11px] text-on-surface-variant/70">
                    Dica: Use as teclas <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface font-mono">1</kbd> a <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface font-mono">5</kbd> para selecionar e <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface font-mono">→</kbd> para avançar.
                </p>
            </div>

            {/* Modal de Confirmação de Saída */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-60 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-6 shadow-2xl">
                        <div className="space-y-2 text-left">
                            <h3 className="font-heading text-xl font-bold text-on-surface">Deseja pausar o teste?</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Você pode salvar seu progresso para continuar mais tarde ou descartar as respostas dadas até agora.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate('/landingpage')}
                                className="w-full py-3 px-4 text-sm font-semibold bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>Sair e guardar progresso</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => { clearTestSession(); navigate('/landingpage'); }}
                                className="w-full py-3 px-4 text-sm font-medium text-error hover:bg-error-container/20 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Descartar respostas</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowExitConfirm(false)}
                                className="w-full py-2.5 px-4 text-sm font-medium text-on-surface-variant hover:text-on-surface rounded-xl transition-colors cursor-pointer mt-1"
                            >
                                Continuar teste
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}