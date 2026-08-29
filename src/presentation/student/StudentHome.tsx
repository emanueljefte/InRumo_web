import React from 'react';
import { 
  Bell, 
  Settings, 
  Compass, 
  Users, 
  Palette, 
  ChevronRight 
} from 'lucide-react';

export default function StudentHomePage() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-8">
      
      {/* Topo: Notificações */}
      <div className="flex justify-end">
        <button 
          type="button"
          className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c9932e] rounded-full" />
        </button>
      </div>

      {/* Cabeçalho de Boas-Vindas */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1b22] tracking-tight">
          Olá, João! Vamos descobrir o seu futuro?
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Continue a sua jornada de autodescoberta vocacional.
        </p>
      </div>

      {/* Layout Principal em 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Lado Esquerdo: Card de Teste em Progresso */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#fffdfa] via-white to-[#fbf5e8]/40 rounded-3xl border border-[#d4c4b0]/60 p-6 sm:p-8 shadow-2xs relative overflow-hidden space-y-6">
          
          {/* Tag + Ícone */}
          <div className="flex items-center justify-between">
            <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-[#d4c4b0]/40">
              Em Progresso
            </span>
            <div className="w-10 h-10 rounded-full bg-[#fbf5e8] flex items-center justify-center text-[#7e5700]">
              <Settings className="w-5 h-5" />
            </div>
          </div>

          {/* Título & Descrição do Teste */}
          <div className="space-y-2 max-w-lg">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1a1b22]">
              Teste de Perfil Vocacional
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
              Descubra as suas principais aptidões e interesses para alinhar as suas escolhas académicas com o seu perfil natural.
            </p>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#827564]">Progresso atual</span>
              <span className="text-[#1a1b22]">65%</span>
            </div>
            <div className="w-full bg-[#eeedf7] h-3 rounded-full overflow-hidden">
              <div 
                className="bg-[#c9932e] h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: '65%' }}
              />
            </div>
          </div>

          {/* Botão de Continuar */}
          <div className="pt-2">
            <button 
              type="button"
              className="bg-[#c9932e] hover:bg-[#b07f24] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-150"
            >
              Continuar agora
            </button>
          </div>
        </div>

        {/* Lado Direito: Explorar Áreas */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Título da Seção */}
          <div className="flex items-center gap-2 text-[#1a1b22]">
            <Compass className="w-4 h-4 text-[#7e5700]" />
            <h3 className="font-heading text-base font-bold tracking-tight">
              Explorar Áreas
            </h3>
          </div>

          {/* Lista de Áreas */}
          <div className="space-y-3">
            
            {/* Item 1: Engenharias */}
            <div className="group bg-white hover:bg-[#fbf8ff] rounded-2xl border border-[#e8e7f1] hover:border-[#d4c4b0] p-4 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f4f2fd] group-hover:bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center shrink-0 transition-colors">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                    Engenharias
                  </h4>
                  <p className="font-body text-xs text-[#827564]">
                    5 testes sugeridos
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#827564] group-hover:text-[#1a1b22] group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Item 2: Ciências Sociais */}
            <div className="group bg-white hover:bg-[#fbf8ff] rounded-2xl border border-[#e8e7f1] hover:border-[#d4c4b0] p-4 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f4f2fd] group-hover:bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center shrink-0 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                    Ciências Sociais
                  </h4>
                  <p className="font-body text-xs text-[#827564]">
                    3 testes sugeridos
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#827564] group-hover:text-[#1a1b22] group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Item 3: Artes e Humanidades */}
            <div className="group bg-white hover:bg-[#fbf8ff] rounded-2xl border border-[#e8e7f1] hover:border-[#d4c4b0] p-4 transition-all cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f4f2fd] group-hover:bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center shrink-0 transition-colors">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#1a1b22]">
                    Artes e Humanidades
                  </h4>
                  <p className="font-body text-xs text-[#827564]">
                    4 testes sugeridos
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#827564] group-hover:text-[#1a1b22] group-hover:translate-x-0.5 transition-all" />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}