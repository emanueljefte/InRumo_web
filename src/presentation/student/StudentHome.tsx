import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Sparkles,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Calendar,
  Compass,
  CheckCircle2,
  ChevronRight,
  Bot
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { useTestResult } from '../../application/test/useTestResult';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { AREAS } from '../../domain/test/Area';

export default function StudentHomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
  const { result, loading } = useTestResult(testRepository);

  // Layout Skeleton para quando os dados do resultado estiverem a carregar
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 bg-surface-container-high rounded-xl w-64" />
          <div className="h-4 bg-surface-container-high rounded-lg w-96" />
        </div>
        <div className="h-64 bg-surface-container-high rounded-3xl" />
        <div className="h-24 bg-surface-container-high rounded-2xl" />
      </div>
    );
  }

  const hasResult = Boolean(result?.recommendedAreaId);
  const recommendedArea = hasResult && result?.recommendedAreaId ? AREAS[result.recommendedAreaId] : null;

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn">
      
      {/* BOAS-VINDAS / CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Painel do Estudante</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Olá, {profile?.nome ? profile.nome.split(' ')[0] : 'Estudante'}! 👋
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant">
            {hasResult
              ? 'A tua avaliação vocacional foi concluída. Confere os teus resultados abaixo.'
              : 'Descobre qual é a especialização do teu curso que melhor combina com as tuas aptidões.'}
          </p>
        </div>
      </div>

      {/* HERO CARD PRINCIPAL: RESULTADO OU CHAMADA PARA TESTE */}
      {hasResult && recommendedArea ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-primary/5 rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Área Recomendada
            </span>
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Avaliação Concluída
            </span>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              {recommendedArea.nome}
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
              {recommendedArea.descricao || 'Análise baseada nos teus interesses técnicos, habilidades acadêmicas e respostas do teste vocacional.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/results')}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer"
            >
              <span>Ver Detalhes Completos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="inline-flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-all border border-outline-variant/40 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Falar com Orientador</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-primary/5 rounded-3xl border border-outline-variant/60 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Teste Vocacional Pendente
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Descobre o teu perfil vocacional no InRumo
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Responde a perguntas rápidas sobre as tuas preferências técnicas e académicas para obteres um diagnóstico detalhado da tua jornada universitária.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/tests')}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            <span>Começar Avaliação Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ATALHOS RÁPIDOS (QUICK GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div
          onClick={() => navigate('/tests')}
          className="group p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-on-surface flex items-center justify-between">
              <span>Testes de Orientação</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Avalia as tuas aptidões e interesses.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/results')}
          className="group p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-on-surface flex items-center justify-between">
              <span>Relatório de Desempenho</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Consulta estatísticas e diagnósticos.</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/schedule')}
          className="group p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-on-surface flex items-center justify-between">
              <span>Sessões Acadêmicas</span>
              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Agenda encontros com tutores.</p>
          </div>
        </div>

      </div>

      {/* BANNER DO ASSISTENTE DE CHAT IA + HUMANO */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-surface-container-lowest rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-heading font-bold text-sm sm:text-base text-on-surface">
                Orientador IA & Suporte Acadêmico
              </p>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                Online
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Tira dúvidas sobre planos de estudos, cadeiras do curso e saídas profissionais.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Abrir Chat</span>
        </button>
      </div>

    </div>
  );
}