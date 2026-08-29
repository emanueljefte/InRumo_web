import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Bookmark,
  GitCompare,
  Clock,
  TrendingUp,
  Coins,
  GraduationCap,
  Cpu,
  ShieldAlert,
  Cloud,
  Database,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Quote,
  Briefcase,
  Layers
} from 'lucide-react';

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [openCurriculumYear, setOpenCurriculumYear] = useState<number | null>(null);

  const toggleCurriculum = (year: number) => {
    setOpenCurriculumYear(openCurriculumYear === year ? null : year);
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 font-sans text-[#1a1b22] antialiased pb-12">
      
      {/* NAVEGAÇÃO SUPERIOR & NOTIFICAÇÕES */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#504536] hover:text-[#1a1b22] bg-white border border-[#e8e7f1] hover:border-[#d4c4b0] px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Voltar aos Resultados</span>
        </button>

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

      {/* CABEÇALHO DO CURSO E VISÃO GERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lado Esquerdo: Título, Descrição e Botões */}
        <div className="lg:col-span-8 space-y-5">
          
          <div className="flex items-center gap-2">
            <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#d4c4b0]/40">
              Engenharia
            </span>
            <span className="bg-[#e0f2fe] text-[#0284c7] text-[11px] font-semibold px-3 py-1 rounded-full">
              Tecnologia
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1b22] tracking-tight">
            Engenharia Informática
          </h1>

          <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
            O curso de Engenharia Informática prepara profissionais capazes de conceber, desenvolver e gerir sistemas informáticos complexos. Aliando fortes bases matemáticas e de engenharia com as mais recentes tecnologias de software e hardware, é um dos cursos com maior índice de empregabilidade e relevância no mercado global.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#7e5700] text-white'
                  : 'bg-[#7e5700] hover:bg-[#604100] text-white'
              }`}
            >
              <Bookmark size={16} className={isSaved ? 'fill-white' : ''} />
              <span>{isSaved ? 'Curso Guardado' : 'Guardar Curso'}</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-[#1a1b22] bg-white border border-[#d4c4b0] hover:bg-[#f4f2fd] transition-colors cursor-pointer"
            >
              <GitCompare size={16} className="text-[#827564]" />
              <span>Comparar</span>
            </button>
          </div>

        </div>

        {/* Lado Direito: Visão Geral (Card Flutuante) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs space-y-4">
          <h3 className="font-heading text-base font-bold text-[#1a1b22]">
            Visão Geral
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#827564]">
                <Clock size={16} />
                <span>Duração</span>
              </div>
              <span className="font-bold text-[#1a1b22]">3 Anos (Licenciatura)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#827564]">
                <TrendingUp size={16} />
                <span>Empregabilidade</span>
              </div>
              <span className="font-bold text-[#1a1b22]">98.5%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#827564]">
                <Coins size={16} />
                <span>Salário Inicial Médio</span>
              </div>
              <span className="font-bold text-[#1a1b22]">1.400€ - 1.800€</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#827564]">
                <GraduationCap size={16} />
                <span>Grau</span>
              </div>
              <span className="font-bold text-[#1a1b22]">Licenciatura / Mestrado</span>
            </div>
          </div>
        </div>

      </div>

      {/* SEÇÃO: ÁREAS DE ESPECIALIZAÇÃO & SAÍDAS PROFISSIONAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        
        {/* Esquerda: Áreas de Especialização (2x2 Grid) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-[#1a1b22]">
            <Layers className="w-5 h-5 text-[#7e5700]" />
            <h2 className="font-heading text-lg font-bold">
              Áreas de Especialização
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Inteligência Artificial */}
            <div className="bg-white rounded-3xl border border-[#e8e7f1] p-5 space-y-3 shadow-2xs hover:border-[#d4c4b0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#fbf5e8] text-[#7e5700] flex items-center justify-center">
                <Cpu size={20} />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#1a1b22]">
                Inteligência Artificial
              </h3>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Machine learning, redes neuronais e sistemas autónomos para resolução de problemas complexos.
              </p>
            </div>

            {/* Cibersegurança */}
            <div className="bg-white rounded-3xl border border-[#e8e7f1] p-5 space-y-3 shadow-2xs hover:border-[#d4c4b0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#fef2f2] text-[#ef4444] flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#1a1b22]">
                Cibersegurança
              </h3>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Proteção de sistemas, redes e dados contra ataques digitais, criptografia e auditoria.
              </p>
            </div>

            {/* Engenharia de Software */}
            <div className="bg-white rounded-3xl border border-[#e8e7f1] p-5 space-y-3 shadow-2xs hover:border-[#d4c4b0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                <Cloud size={20} />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#1a1b22]">
                Engenharia de Software
              </h3>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Arquitetura, desenvolvimento e manutenção de aplicações e sistemas de larga escala.
              </p>
            </div>

            {/* Sistemas de Informação */}
            <div className="bg-white rounded-3xl border border-[#e8e7f1] p-5 space-y-3 shadow-2xs hover:border-[#d4c4b0] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#f4f2fd] text-[#504536] flex items-center justify-center">
                <Database size={20} />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#1a1b22]">
                Sistemas de Informação
              </h3>
              <p className="font-body text-xs text-[#827564] leading-relaxed">
                Gestão de dados empresariais, análise de big data e infraestruturas cloud.
              </p>
            </div>

          </div>
        </div>

        {/* Direita: Saídas Profissionais */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-[#1a1b22]">
            <Briefcase className="w-5 h-5 text-[#7e5700]" />
            <h2 className="font-heading text-lg font-bold">
              Saídas Profissionais
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-5 shadow-2xs space-y-3 divide-y divide-[#e8e7f1]/60">
            
            <div className="pt-2 first:pt-0 flex items-center justify-between group cursor-pointer">
              <div className="space-y-0.5">
                <h4 className="font-heading text-sm font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors">
                  Software Developer
                </h4>
                <p className="text-xs text-[#827564]">
                  Desenvolvimento frontend, backend ou full-stack.
                </p>
              </div>
              <ChevronRight size={16} className="text-[#827564] group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="pt-3 flex items-center justify-between group cursor-pointer">
              <div className="space-y-0.5">
                <h4 className="font-heading text-sm font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors">
                  Engenheiro de Dados (Data Engineer)
                </h4>
                <p className="text-xs text-[#827564]">
                  Construção e manutenção de pipelines de dados.
                </p>
              </div>
              <ChevronRight size={16} className="text-[#827564] group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="pt-3 flex items-center justify-between group cursor-pointer">
              <div className="space-y-0.5">
                <h4 className="font-heading text-sm font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors">
                  Arquiteto de Sistemas Cloud
                </h4>
                <p className="text-xs text-[#827564]">
                  Desenho de infraestruturas escaláveis (AWS, Azure, GCP).
                </p>
              </div>
              <ChevronRight size={16} className="text-[#827564] group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="pt-3 flex items-center justify-between group cursor-pointer">
              <div className="space-y-0.5">
                <h4 className="font-heading text-sm font-bold text-[#1a1b22] group-hover:text-[#7e5700] transition-colors">
                  Consultor de TI
                </h4>
                <p className="text-xs text-[#827564]">
                  Apoio estratégico em transformação digital empresarial.
                </p>
              </div>
              <ChevronRight size={16} className="text-[#827564] group-hover:translate-x-0.5 transition-all" />
            </div>

          </div>
        </div>

      </div>

      {/* SEÇÃO: GRADE CURRICULAR (SANFONA / ACCORDION) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-[#1a1b22]">
          <GraduationCap className="w-5 h-5 text-[#7e5700]" />
          <h2 className="font-heading text-lg font-bold">
            Grade Curricular
          </h2>
        </div>

        <div className="space-y-3">
          
          {/* 1.º Ano */}
          <div className="bg-white rounded-2xl border border-[#e8e7f1] overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleCurriculum(1)}
              className="w-full p-5 flex items-center justify-between text-left font-heading text-sm sm:text-base font-bold text-[#1a1b22] hover:bg-[#fbf8ff] transition-colors"
            >
              <span>1.º Ano: Fundamentos de Engenharia</span>
              {openCurriculumYear === 1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openCurriculumYear === 1 && (
              <div className="p-5 pt-0 text-xs text-[#504536] border-t border-[#e8e7f1]/60 space-y-2">
                <p>• Análise Matemática I e II</p>
                <p>• Álgebra Linear e Geometria Analítica</p>
                <p>• Introdução à Programação (Python / C++)</p>
                <p>• Arquitetura de Computadores</p>
              </div>
            )}
          </div>

          {/* 2.º Ano */}
          <div className="bg-white rounded-2xl border border-[#e8e7f1] overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleCurriculum(2)}
              className="w-full p-5 flex items-center justify-between text-left font-heading text-sm sm:text-base font-bold text-[#1a1b22] hover:bg-[#fbf8ff] transition-colors"
            >
              <span>2.º Ano: Sistemas e Estruturas Core</span>
              {openCurriculumYear === 2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openCurriculumYear === 2 && (
              <div className="p-5 pt-0 text-xs text-[#504536] border-t border-[#e8e7f1]/60 space-y-2">
                <p>• Algoritmos e Estruturas de Dados</p>
                <p>• Sistemas Operativos</p>
                <p>• Bases de Dados e Modelação SQL/NoSQL</p>
                <p>• Engenharia de Software I</p>
              </div>
            )}
          </div>

          {/* 3.º Ano */}
          <div className="bg-white rounded-2xl border border-[#e8e7f1] overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => toggleCurriculum(3)}
              className="w-full p-5 flex items-center justify-between text-left font-heading text-sm sm:text-base font-bold text-[#1a1b22] hover:bg-[#fbf8ff] transition-colors"
            >
              <span>3.º Ano: Especialização e Projeto Final</span>
              {openCurriculumYear === 3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openCurriculumYear === 3 && (
              <div className="p-5 pt-0 text-xs text-[#504536] border-t border-[#e8e7f1]/60 space-y-2">
                <p>• Computação em Nuvem e DevOps</p>
                <p>• Inteligência Artificial Aplicada</p>
                <p>• Cibersegurança e Redes Avançadas</p>
                <p>• Projeto Final de Licenciatura / Estágio</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SEÇÃO: O QUE DIZEM OS ALUMNI */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-[#1a1b22]">
          <Quote className="w-5 h-5 text-[#7e5700]" />
          <h2 className="font-heading text-lg font-bold">
            O que dizem os Alumni
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Testemunho 1 */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs flex flex-col justify-between space-y-4">
            <p className="font-body text-xs text-[#504536] leading-relaxed relative">
              "A exigência teórica do início do curso compensa totalmente quando chegamos ao mercado de trabalho. A capacidade analítica desenvolvida é o que me permite hoje arquitetar sistemas distribuídos para milhares de utilizadores."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[#e8e7f1]/60">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
                alt="Mariana Silva"
                className="w-10 h-10 rounded-full object-cover border border-[#e8e7f1]"
              />
              <div>
                <h4 className="font-heading text-xs font-bold text-[#1a1b22]">
                  Mariana Silva
                </h4>
                <p className="text-[11px] text-[#827564]">
                  Senior Backend Engineer na TechLogis
                </p>
              </div>
            </div>
          </div>

          {/* Testemunho 2 */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs flex flex-col justify-between space-y-4">
            <p className="font-body text-xs text-[#504536] leading-relaxed">
              "Sempre tive interesse em segurança, e a flexibilidade do último ano permitiu-me direcionar o estudo para cibersegurança. Saí empregado e com uma base sólida que nenhum bootcamp conseguiria dar."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[#e8e7f1]/60">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                alt="João Mendes"
                className="w-10 h-10 rounded-full object-cover border border-[#e8e7f1]"
              />
              <div>
                <h4 className="font-heading text-xs font-bold text-[#1a1b22]">
                  João Mendes
                </h4>
                <p className="text-[11px] text-[#827564]">
                  Cybersecurity Analyst
                </p>
              </div>
            </div>
          </div>

          {/* Testemunho 3 */}
          <div className="bg-white rounded-3xl border border-[#e8e7f1] p-6 shadow-2xs flex flex-col justify-between space-y-4">
            <p className="font-body text-xs text-[#504536] leading-relaxed">
              "O InRumo ajudou-me a perceber que Engenharia Informática era mais do que 'programar'. A vertente de Sistemas de Informação encaixava perfeitamente no meu perfil analítico e hoje trabalho na ponte entre negócio e tecnologia."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[#e8e7f1]/60">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120"
                alt="Sofia Costa"
                className="w-10 h-10 rounded-full object-cover border border-[#e8e7f1]"
              />
              <div>
                <h4 className="font-heading text-xs font-bold text-[#1a1b22]">
                  Sofia Costa
                </h4>
                <p className="text-[11px] text-[#827564]">
                  Product Manager
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}