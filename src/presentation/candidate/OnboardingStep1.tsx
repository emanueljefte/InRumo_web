import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  Palette, 
  HeartPulse, 
  Briefcase, 
  Code2, 
  Scale, 
  Microscope, 
  Megaphone,
  ArrowRight,
  Check
} from 'lucide-react';

interface InterestArea {
  id: string;
  label: string;
  icon: React.ElementType;
}

const INTEREST_AREAS: InterestArea[] = [
  { id: 'engineering', label: 'Engenharia', icon: Cpu },
  { id: 'arts', label: 'Artes', icon: Palette },
  { id: 'health', label: 'Saúde', icon: HeartPulse },
  { id: 'management', label: 'Gestão', icon: Briefcase },
  { id: 'technology', label: 'Tecnologia', icon: Code2 },
  { id: 'law', label: 'Direito', icon: Scale },
  { id: 'science', label: 'Ciências', icon: Microscope },
  { id: 'communication', label: 'Comunicação', icon: Megaphone },
];

export default function OnboardingStep1Page() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedAreas.length > 0) {
      navigate('/onboarding/step-2');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col justify-between font-sans text-[#1a1b22] antialiased">
      
      {/* Barra de Progresso Superior */}
      <div className="w-full bg-[#e8e7f1] h-1.5">
        <div className="bg-[#7e5700] h-full w-1/4 transition-all duration-300" />
      </div>

      {/* Conteúdo Principal Centralizado */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center items-center space-y-8 sm:space-y-12">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c9932e]">
            Passo 1 de 4
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-[#1a1b22] tracking-tight">
            Quais são as tuas áreas de interesse?
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
            Seleciona as áreas que mais te despertam curiosidade. Isto ajudar-nos-á a personalizar o teu plano de carreira. Podes escolher várias opções.
          </p>
        </div>

        {/* Grelha de Cartões de Áreas de Interesse */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
          {INTEREST_AREAS.map((area) => {
            const Icon = area.icon;
            const isSelected = selectedAreas.includes(area.id);

            return (
              <button
                key={area.id}
                type="button"
                onClick={() => toggleArea(area.id)}
                className={`relative group p-6 sm:p-8 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer ${
                  isSelected
                    ? 'bg-[#fbf5e8] border-[#7e5700] shadow-2xs ring-1 ring-[#7e5700]'
                    : 'bg-white border-[#e8e7f1] hover:border-[#d4c4b0] hover:bg-white/80'
                }`}
              >
                {/* Indicador Check se Selecionado */}
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#7e5700] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}

                {/* Ícone */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#7e5700] text-white'
                      : 'bg-[#f4f2fd] text-[#504536] group-hover:bg-[#fbf5e8] group-hover:text-[#7e5700]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>

                {/* Rótulo */}
                <span
                  className={`font-heading text-sm sm:text-base font-bold transition-colors ${
                    isSelected ? 'text-[#7e5700]' : 'text-[#1a1b22]'
                  }`}
                >
                  {area.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Botão de Continuar */}
        <div className="pt-4 w-full max-w-xs">
          <button
            type="button"
            disabled={selectedAreas.length === 0}
            onClick={handleContinue}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
              selectedAreas.length > 0
                ? 'bg-[#c9932e] hover:bg-[#7e5700] text-white cursor-pointer active:scale-[0.99]'
                : 'bg-[#d4c4b0]/50 text-white/80 cursor-not-allowed'
            }`}
          >
            <span>Continuar</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </main>

      {/* Espaçador de Rodapé */}
      <footer className="py-4 text-center text-[11px] text-[#827564]">
        InRumo Vocational Guidance © 2026
      </footer>

    </div>
  );
}