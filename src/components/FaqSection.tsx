import { ChevronDown } from "lucide-react";
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

  return (
    <section className="py-20 bg-surface-container-lowest border-t border-outline-variant/50">
      <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg max-w-2xl">
        <h2 className="font-heading text-headline-lg text-on-surface text-center mb-10">
          Perguntas frequentes
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => (
            <div key={item.q} className="border border-outline-variant/60 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center px-5 py-4 text-left"
              >
                <span className="font-body-md font-medium text-on-surface">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-on-surface-variant transition-transform shrink-0 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <p className="px-5 pb-4 font-body-sm text-on-surface-variant leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}