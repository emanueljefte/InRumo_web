import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: 'O teste vocacional é gratuito?',
    a: 'Sim. Podes fazer o teste e ver o resultado sem qualquer custo e sem criar conta.',
  },
  {
    q: 'Quanto tempo demora?',
    a: 'Entre 8 a 10 minutos, em média.',
  },
  {
    q: 'Preciso de criar conta para ver o resultado?',
    a: 'Não. O resultado é apresentado de imediato. Criar conta permite guardares o histórico e desbloqueares informação completa do curso recomendado.',
  },
  {
    q: 'Já fiz o teste sem conta — perco o resultado se me registar depois?',
    a: 'Não, o resultado é associado automaticamente à tua conta assim que te registares a seguir.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  {/* --- SECÇÃO: PERGUNTAS FREQUENTES (FAQ) --- */ }
  return (
    < section className="py-24 bg-surface-container-lowest border-t border-outline-variant/40 relative" >
      <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg max-w-3xl">

        {/* Cabeçalho */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tira as tuas dúvidas</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Perguntas <span className="text-primary">frequentes</span>
          </h2>
          <p className="text-sm text-on-surface-variant">
            Tudo o que precisas de saber sobre o teste vocacional do InRumo e a integração com o INSTIC.
          </p>
        </div>

        {/* Lista de Accordions */}
        <div className="space-y-3.5">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                  ? 'bg-surface-container-low/60 border-primary/40 shadow-sm'
                  : 'bg-surface-container-lowest border-outline-variant/60 hover:border-outline-variant'
                  }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className={`font-heading text-sm sm:text-base font-bold transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                    }`}>
                    {item.q}
                  </span>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${isOpen
                    ? 'bg-primary text-on-primary rotate-180'
                    : 'bg-surface-container-high text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Conteúdo Expansível com Animação */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-outline-variant/30 text-xs sm:text-sm font-body-sm text-on-surface-variant leading-relaxed animate-in fade-in-50 duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card de Suporte Adicional */}
        {/* <div className="mt-12 p-6 rounded-2xl bg-surface-container-low/40 border border-outline-variant/50 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-heading font-bold text-on-surface text-sm">Ainda tens dúvidas?</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">Fala diretamente com o nosso assistente de orientação por IA.</p>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-on-primary border border-primary/20 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Conversar com a IA
          </button>
        </div> */}

      </div>
    </section >
  );
}