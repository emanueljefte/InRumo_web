import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  MessageCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SpecializationArea {
  id: string;
  title: string;
  percentage: number;
  colorClass: string;
}

const AREAS: SpecializationArea[] = [
  {
    id: '1',
    title: 'Arquitetura de Software & Cloud',
    percentage: 92,
    colorClass: 'bg-[#c9932e]', // Dourado principal
  },
  {
    id: '2',
    title: 'Cibersegurança & Defesa',
    percentage: 84,
    colorClass: 'bg-[#46739e]', // Azul escuro
  },
  {
    id: '3',
    title: 'Inteligência Artificial & Dados',
    percentage: 78,
    colorClass: 'bg-[#8baad0]', // Azul claro
  },
];

export default function ResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      
      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Tua Jornada de Especialização
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536] max-w-3xl">
          Baseado no teu desempenho académico e interesses técnicos, identificamos os caminhos de maior potencial para a tua carreira em Engenharia Informática.
        </p>
      </div>

      {/* Grid Principal: Gráfico + Cards Laterais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lado Esquerdo: Áreas de Especialização (Barras de Progresso) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-8">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1a1b22]">
            Áreas de Especialização Recomendadas
          </h2>

          <div className="space-y-6">
            {AREAS.map((area) => (
              <div key={area.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-[#1a1b22]">{area.title}</span>
                  <span className="text-[#c9932e] font-bold text-sm sm:text-base">
                    {area.percentage}%
                  </span>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full bg-[#f4f2fd] h-3 rounded-full overflow-hidden">
                  <div
                    className={`${area.colorClass} h-full rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Direito: Cards de Recomendação & Caminho de Carreira */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Card 1: Foco em Mestrado */}
          <div className="bg-[#f8f6ff] rounded-3xl border border-[#e8e7f1] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#7e5700]">
              <GraduationCap className="w-5 h-5" />
              <span className="font-heading text-xs font-bold tracking-wider uppercase">
                Foco em Mestrado
              </span>
            </div>

            <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
              O seu perfil analítico é altamente compatível com o Mestrado em Engenharia de Software. Recomendamos focar em projetos de sistemas distribuídos no próximo semestre.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#d4c4b0]/40">
                Sistemas
              </span>
              <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#d4c4b0]/40">
                Escalabilidade
              </span>
            </div>
          </div>

          {/* Card 2: Caminhos de Carreira */}
          <div 
            onClick={() => navigate('/documents')}
            className="group bg-white hover:bg-[#fbf8ff] rounded-3xl border border-[#e8e7f1] hover:border-[#d4c4b0] p-6 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1 pr-4">
              <h3 className="font-heading text-base font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors">
                Caminhos de Carreira
              </h3>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Explore as oportunidades de mercado para especialistas em Arquitetura.
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-xl bg-[#f4f2fd] group-hover:bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center shrink-0 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

        </div>

      </div>

      {/* Banner Inferior: CTA para o Chat / Agendamento */}
      <div className="bg-gradient-to-r from-white via-[#fbf8ff] to-[#fbf5e8]/50 rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
        
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1a1b22]">
            Queres saber mais sobre as saídas profissionais?
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#504536]">
            Agenda uma sessão com um mentor de carreira ou um docente da área para discutir estes caminhos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-2xl shadow-xs transition-all duration-150 flex items-center gap-2.5 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Ir para o Chat
        </button>

      </div>

    </div>
  );
}