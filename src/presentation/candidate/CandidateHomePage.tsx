import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings,
} from 'lucide-react';
import { useAuth } from '../../application/auth/useAuth';
import { TakeTestPromptCard } from '../../components/TakeTestPromptCard';
import { RecommendedCourseCard } from '../../components/RecommendedCourseCard';
import { useMemo } from 'react';
import { SupabaseTestRepository } from '../../data/supabase/SupabaseTestRepository';
import { useTestResult } from '../../application/test/useTestResult';
import { CoursesCatalogTeaser } from '../course/CoursesCatalogTeaser';

export default function CandidateHomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const testRepository = useMemo(() => new SupabaseTestRepository(), []);
const { result, loading } = useTestResult(testRepository);

  if (loading) return null;

  return (
    <div className="max-w-275 mx-auto space-y-8 font-body text-on-background antialiased">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
          Olá, {profile?.nome ?? 'candidato'}!
        </h1>
        <p className="font-body-md text-on-surface-variant">
          {result ? 'Aqui está o teu percurso até agora.' : 'Pronto para descobrir o curso certo para ti?'}
        </p>
      </div>

      {result ? (
        <RecommendedCourseCard result={result} />
      ) : (
        <TakeTestPromptCard onStart={() => navigate('/candidate/test')} />
      )}

      <CoursesCatalogTeaser /> {/* os 3 cursos reais, com link para /course/:id */}
    
      {/* Topo: Notificações */}
      <div className="flex justify-end">
        <button 
          type="button"
          className="p-2.5 text-[#504536] hover:text-[#1a1b22] hover:bg-[#eeedf7] rounded-full transition-colors relative"
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>

      {/* Cabeçalho para Ingressante */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1b22] tracking-tight">
          Olá, João! Pronto para decidir o seu curso?
        </h1>
        <p className="font-body text-sm sm:text-base text-[#504536]">
          Complete os seus testes e prepare-se para a sua pré-matrícula.
        </p>
      </div>

      {/* Grid Principal de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Lado Esquerdo: Card do Teste Vocacional Principal */}
        <div className="lg:col-span-8 bg-linear-to-br from-[#fffdfa] via-white to-[#fbf5e8]/40 rounded-3xl border border-[#d4c4b0]/60 p-6 sm:p-8 shadow-2xs relative overflow-hidden space-y-6">
          
          <div className="flex items-center justify-between">
            <span className="bg-[#fbf5e8] text-[#7e5700] text-[11px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-[#d4c4b0]/40">
              Em Progresso
            </span>
            <div className="w-10 h-10 rounded-full bg-[#fbf5e8] flex items-center justify-center text-[#7e5700]">
              <Settings className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1a1b22]">
              Teste de Perfil Vocacional
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#504536] leading-relaxed">
              Descubra as suas principais aptidões e interesses para alinar as suas escolhas académicas com o seu perfil natural.
            </p>
          </div>

          {/* Botão de Ação */}
          <div className="pt-2">
            <button 
              type="button"
              onClick={() => navigate('/quiz/vocational/run')}
              className="bg-primary hover:bg-[#b07f24] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
            >
              Continuar agora
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}