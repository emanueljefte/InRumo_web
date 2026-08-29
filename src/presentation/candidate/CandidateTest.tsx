import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  ArrowRight, 
  Compass, 
  Lightbulb, 
  Palette, 
  Microscope 
} from 'lucide-react';

interface KnowledgeAreaTest {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const KNOWLEDGE_TESTS: KnowledgeAreaTest[] = [
  {
    id: 'exatas',
    category: 'Exatas',
    title: 'Aptidão Lógico-Matemática',
    description: 'Avaliação focada em resolução de problemas complexos, raciocínio espacial e pensamento estruturado.',
    icon: Compass,
  },
  {
    id: 'humanas',
    category: 'Humanas e Artes',
    title: 'Perfil Criativo-Expressivo',
    description: 'Identifique tendências para áreas que demandam inovação visual, comunicação e pensamento lateral.',
    icon: Palette,
  },
  {
    id: 'biologicas',
    category: 'Biológicas e Saúde',
    title: 'Interesses em Biociências',
    description: 'Explore sua afinidade com pesquisa científica, cuidado com a saúde e ciências da natureza.',
    icon: Microscope,
  },
];

export default function CandidateTestsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased">
      
      {/* Barra de Pesquisa Superior & Notificações */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#827564]" />
          <input
            type="text"
            placeholder="Buscar testes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#eeedf7]/50 focus:bg-white border border-transparent focus:border-[#7e5700] text-xs text-[#1a1b22] placeholder:text-[#827564]/70 pl-11 pr-4 py-3 rounded-full outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
            aria-label="Notificações"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            alt="Perfil do utilizador"
            className="w-9 h-9 rounded-full object-cover border border-[#e8e7f1]"
          />
        </div>
      </div>

      {/* Título & Subtítulo */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a1b22] tracking-tight">
          Testes Vocacionais
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Avalie suas aptidões e interesses para encontrar os caminhos académicos e profissionais mais adequados ao seu perfil.
        </p>
      </div>

      {/* SEÇÃO PRINCIPAL: TESTE EM ANDAMENTO & INVENTÁRIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: Teste em Andamento (Destaque Grande) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#fffdfa] via-white to-[#fbf5e8]/50 rounded-3xl border border-[#d4c4b0]/60 p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#c9932e] text-white text-[11px] font-bold tracking-wide px-3.5 py-1 rounded-full">
                Em Andamento
              </span>
              <div className="flex items-center gap-1.5 bg-[#f4f2fd]/80 text-[#504536] text-xs font-medium px-3 py-1.5 rounded-full border border-[#e8e7f1]">
                <Clock className="w-3.5 h-3.5 text-[#827564]" />
                <span>~ 45 min</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1a1b22]">
                Teste de Perfil Vocacional Completo
              </h2>
              <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed max-w-xl">
                Uma avaliação abrangente baseada em múltiplas inteligências e teoria das escolhas ocupacionais. Fundamental para a primeira etapa da sua jornada.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#827564]">Progresso Atual</span>
                <span className="text-[#1a1b22]">65% Concluído</span>
              </div>
              <div className="w-full bg-[#eeedf7] h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-[#7e5700] h-full rounded-full transition-all duration-500" 
                  style={{ width: '65%' }}
                />
              </div>
            </div>

            {/* Botão de Continuar */}
            <div className="flex justify-end">
              <button 
                type="button"
                className="bg-[#7e5700] hover:bg-[#604100] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <span>Continuar Teste</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Card 2: Inventário de Valores (Secundário) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#e8e7f1] p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-lg font-bold text-[#1a1b22]">
                Inventário de Valores
              </h3>
              <p className="font-body text-xs text-[#504536] leading-relaxed">
                Descubra o que é mais importante para você no ambiente de trabalho: autonomia, estabilidade, liderança ou criatividade.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e8e7f1]/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#827564] font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>15 min</span>
            </div>

            <button
              type="button"
              className="text-xs font-bold text-[#7e5700] hover:text-[#604100] transition-colors"
            >
              Iniciar
            </button>
          </div>

        </div>

      </div>

      {/* SEÇÃO: TESTES POR ÁREA DE CONHECIMENTO */}
      <div className="space-y-5 pt-4">
        
        <div className="border-b border-[#e8e7f1] pb-3">
          <h2 className="font-heading text-lg font-bold text-[#1a1b22]">
            Testes por Área de Conhecimento
          </h2>
        </div>

        {/* Grelha de Cartões de Áreas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KNOWLEDGE_TESTS.map((test) => {
            const Icon = test.icon;

            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs flex flex-col justify-between space-y-6 hover:border-[#d4c4b0] transition-all"
              >
                <div className="space-y-4">
                  {/* Topo do Card com Categoria e Ícone */}
                  <div className="flex items-center justify-between">
                    <span className="bg-[#f4f2fd] text-[#504536] text-[11px] font-medium px-3 py-1 rounded-full border border-[#e8e7f1]">
                      {test.category}
                    </span>
                    <Icon className="w-5 h-5 text-[#827564] stroke-[1.8]" />
                  </div>

                  {/* Título e Descrição */}
                  <div className="space-y-2">
                    <h3 className="font-heading text-base font-bold text-[#1a1b22]">
                      {test.title}
                    </h3>
                    <p className="font-body text-xs text-[#827564] leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                </div>

                {/* Botão Iniciar Avaliação */}
                <button
                  type="button"
                  className="w-full bg-white hover:bg-[#f4f2fd] text-[#1a1b22] text-xs font-semibold py-2.5 px-4 rounded-xl border border-[#d4c4b0] transition-colors text-center"
                >
                  Iniciar Avaliação
                </button>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}