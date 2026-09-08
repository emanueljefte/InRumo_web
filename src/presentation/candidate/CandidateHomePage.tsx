import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { useTestResult } from '../../application/test/useTestResult';
import { RecommendedCourseCard } from '../../components/RecommendedCourseCard';
import { TakeTestPromptCard } from '../../components/TakeTestPromptCard';
import { CoursesCatalogTeaser } from '../course/CoursesCatalogTeaser';

export default function CandidateHomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const { result, loading } = useTestResult(testRepository);

  // Determina a saudação com base na hora do dia
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = profile?.nome?.split(' ')[0] ?? 'Candidato';

  // Skeleton de Carregamento elegante (evita que o ecrã pisque em branco)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse p-4">
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded-lg w-64" />
          <div className="h-4 bg-gray-100 rounded-lg w-96" />
        </div>
        <div className="h-64 bg-gray-100 rounded-3xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-body text-[#1a1b22] antialiased pb-12">
      
      {/* ================= CABEÇALHO PRINCIPAL ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e7f1] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Painel do Candidato</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1b22] tracking-tight">
            {getGreeting()}, {firstName}!
          </h1>
          <p className="font-body text-sm sm:text-base text-[#504536]">
            {result 
              ? 'O teu perfil vocacional está ativo. Consulta o teu curso recomendado e os próximos passos.'
              : 'Pronto para descobrir qual é o curso ideal para o teu futuro no INSTIC?'
            }
          </p>
        </div>

        {/* Badge do Estado Vocacional */}
        <div className="shrink-0">
          {result ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Teste Vocacional Concluído</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Teste Pendente</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= GRID DE CONTEÚDO PRINCIPAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Coluna Principal (8 Colunas) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card Principal: Teste Recomendado ou Resultado */}
          <div>
            {result && result.recommendedCourseId ? (
              <RecommendedCourseCard result={{ ...result, recommendedCourseId: result.recommendedCourseId }} />
            ) : (
              <TakeTestPromptCard onStart={() => navigate('/candidate/test')} />
            )}
          </div>

          {/* Atalhos Rápidos de Ação / Funcionalidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Orientador IA */}
            <div 
              onClick={() => navigate('/candidate/chat')}
              className="group p-5 rounded-2xl bg-white border border-[#e8e7f1] hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Bot className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#827564] group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#1a1b22]">Orientador Vocacional IA</h3>
                <p className="font-body text-xs text-[#504536] mt-1 leading-relaxed">
                  Tira dúvidas sobre saídas profissionais e matrizes curriculares dos cursos.
                </p>
              </div>
            </div>

            {/* Card 2: Catálogo Completo */}
            <div 
              onClick={() => navigate('/candidate/course')}
              className="group p-5 rounded-2xl bg-white border border-[#e8e7f1] hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#827564] group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#1a1b22]">Todos os Cursos</h3>
                <p className="font-body text-xs text-[#504536] mt-1 leading-relaxed">
                  Explora todos os cursos do INSTIC, duração, perfil de entrada e empregabilidade.
                </p>
              </div>
            </div>

          </div>

          {/* Teaser dos Cursos (3 Cursos Reais) */}
          <div className="pt-2">
            <CoursesCatalogTeaser />
          </div>

        </div>

        {/* Coluna Lateral (4 Colunas): Guia & Informações Úteis */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card de Informação sobre Matrícula / Pré-Requisitos */}
          <div className="p-6 rounded-3xl bg-surface-container-high/60 border border-[#e8e7f1] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#1a1b22]">Guia de Admissão</h3>
            </div>
            
            <p className="text-xs text-[#504536] leading-relaxed">
              Após concluíres o teste vocacional e escolheres o curso, segue estes passos para garantir a tua pré-inscrição:
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-start gap-2.5 text-xs text-[#1a1b22]">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Realiza o teste e analisa o teu relatório vocacional.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#1a1b22]">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Lê o plano curricular do curso recomendado.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-[#1a1b22]">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Dirige-te à secretaria do INSTIC com o certificado emitido.</span>
              </li>
            </ul>
          </div>

          {/* Banner de Suporte */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-[#1a1b22] to-[#2d2e38] text-white space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-primary-container text-xs font-semibold">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              <span>Dúvidas no Processo?</span>
            </div>
            <h4 className="font-heading font-bold text-sm">
              Conversa com o nosso Orientador IA
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Pergunta sobre médias de entrada, saídas de mercado e disciplinas de exame de acesso.
            </p>
            <button
              onClick={() => navigate('/candidate/chat')}
              className="w-full mt-2 bg-white text-[#1a1b22] hover:bg-gray-100 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Abrir Chat de Suporte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}