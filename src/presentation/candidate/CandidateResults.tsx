import React from 'react';
import { 
  Bell, 
  Lightbulb, 
  Compass, 
  GraduationCap, 
  ArrowRight 
} from 'lucide-react';

interface OtherArea {
  title: string;
  percentage: number;
  label: string;
}

const OTHER_AREAS: OtherArea[] = [
  { title: 'Matemática Aplicada', percentage: 85, label: 'Afinidade forte' },
  { title: 'Física Computacional', percentage: 78, label: 'Afinidade moderada' },
  { title: 'Gestão de Informação', percentage: 72, label: 'Afinidade moderada' },
];

export default function CandidateResultsPage() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      
      {/* Notificações & Perfil */}
      <div className="flex justify-end items-center gap-3">
        <button 
          type="button"
          className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
          alt="Perfil do utilizador"
          className="w-9 h-9 rounded-full object-cover border border-[#e8e7f1]"
        />
      </div>

      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Resultados do Teste Vocacional
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Análise detalhada do teu perfil e aptidões cognitivas.
        </p>
      </div>

      {/* CARD PRINCIPAL: RECOMENDAÇÃO DE CURSO */}
      <div className="bg-gradient-to-br from-[#fffdfa] via-white to-[#fbf5e8]/40 rounded-3xl border border-[#d4c4b0]/60 p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
        
        <div className="space-y-4 flex-1">
          <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-bold tracking-wide uppercase px-3.5 py-1 rounded-full border border-[#d4c4b0]/40 inline-block">
            ★ Recomendação Principal
          </span>

          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#1a1b22] tracking-tight">
            Engenharia Informática
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed max-w-2xl">
            O teu perfil indica uma forte aptidão para a resolução de problemas lógicos, pensamento estruturado e inovação tecnológica. Esta área combina a tua capacidade analítica com o desejo de criar sistemas escaláveis.
          </p>
        </div>

        {/* Gráfico Circular de Afinidade (92%) */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#eeedf7"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#7e5700"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - 0.92)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] leading-none">
              92%
            </span>
            <span className="text-[10px] text-[#827564] font-semibold mt-1">
              Afinidade
            </span>
          </div>
        </div>

      </div>

      {/* GRID DE DETALHAMENTO: PORQUÊ ESTA ÁREA vs OUTRAS ÁREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lado Esquerdo: Porquê esta área? */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-8 shadow-2xs space-y-6">
          
          <div className="flex items-center gap-2 text-[#1a1b22] border-b border-[#e8e7f1] pb-4">
            <Lightbulb className="w-5 h-5 text-[#7e5700]" />
            <h3 className="font-heading text-base font-bold">
              Porquê esta área?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Raciocínio Lógico */}
            <div className="bg-[#f4f2fd]/60 rounded-2xl p-4 space-y-2 border border-[#e8e7f1]">
              <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                Raciocínio Lógico
              </h4>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Obtiveste um resultado no percentil 95 em testes de lógica dedutiva e indutiva.
              </p>
              <div className="w-full bg-[#eeedf7] h-2 rounded-full overflow-hidden pt-1">
                <div className="bg-[#7e5700] h-full rounded-full w-[95%]" />
              </div>
            </div>

            {/* Aptidão Numérica */}
            <div className="bg-[#f4f2fd]/60 rounded-2xl p-4 space-y-2 border border-[#e8e7f1]">
              <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                Aptidão Numérica
              </h4>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Forte capacidade de análise de dados e resolução de problemas matemáticos complexos.
              </p>
              <div className="w-full bg-[#eeedf7] h-2 rounded-full overflow-hidden pt-1">
                <div className="bg-[#7e5700] h-full rounded-full w-[88%]" />
              </div>
            </div>

            {/* Atenção ao Detalhe */}
            <div className="bg-[#f4f2fd]/60 rounded-2xl p-4 space-y-2 border border-[#e8e7f1]">
              <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                Atenção ao Detalhe
              </h4>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Excelente capacidade de identificar padrões e anomalias em sistemas estruturados.
              </p>
              <div className="w-full bg-[#eeedf7] h-2 rounded-full overflow-hidden pt-1">
                <div className="bg-[#7e5700] h-full rounded-full w-[90%]" />
              </div>
            </div>

            {/* Trabalho Metódico */}
            <div className="bg-[#f4f2fd]/60 rounded-2xl p-4 space-y-2 border border-[#e8e7f1]">
              <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                Trabalho Metódico
              </h4>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Preferência por abordagens sistemáticas e planeamento a longo prazo.
              </p>
              <div className="w-full bg-[#eeedf7] h-2 rounded-full overflow-hidden pt-1">
                <div className="bg-[#7e5700] h-full rounded-full w-[84%]" />
              </div>
            </div>

          </div>

        </div>

        {/* Lado Direito: Outras Áreas */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs space-y-6">
          
          <div className="flex items-center gap-2 text-[#1a1b22] border-b border-[#e8e7f1] pb-4">
            <Compass className="w-5 h-5 text-[#7e5700]" />
            <h3 className="font-heading text-base font-bold">
              Outras Áreas
            </h3>
          </div>

          <div className="space-y-5 divide-y divide-[#e8e7f1]/60">
            {OTHER_AREAS.map((area, idx) => (
              <div key={area.title} className={`flex items-center justify-between ${idx > 0 ? 'pt-4' : ''}`}>
                <div className="space-y-0.5">
                  <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                    {area.title}
                  </h4>
                  <p className="text-[11px] text-[#827564]">
                    {area.label}
                  </p>
                </div>
                <span className="font-heading text-base font-bold text-[#7e5700]">
                  {area.percentage}%
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* BANNER INSCREVE-TE NO INSTIC */}
      <div className="bg-[#f4f2fd]/70 rounded-3xl p-8 sm:p-12 border border-[#e8e7f1] text-center space-y-6 shadow-2xs">
        
        <div className="w-14 h-14 rounded-full bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center mx-auto border border-[#d4c4b0]/40">
          <GraduationCap className="w-7 h-7 stroke-[1.8]" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1a1b22]">
            Desbloqueia o Teu Potencial Completo
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
            Obtém acesso ao relatório detalhado de 30 páginas, aconselhamento personalizado 1-para-1 com especialistas e acesso a programas exclusivos de mentoria.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold px-8 py-4 rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
          >
            <span>Inscreve-te no INSTIC</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}