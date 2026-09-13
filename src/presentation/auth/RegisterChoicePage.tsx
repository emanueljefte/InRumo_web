import { ArrowRight, Compass, GraduationCap, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterChoicePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex bg-[#fbf8ff] antialiased">
      {/* ================= LADO ESQUERDO: Painel Institucional ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-high overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Imagem de Fundo com Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 filter brightness-[0.98] contrast-[0.95]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#fbf8ff]/95 via-[#fbf8ff]/50 to-[#fbf8ff]/70 z-10" />

        {/* Card em Perspectiva (Decoração Visual) */}
        <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-80 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-6 shadow-xl z-10 pointer-events-none opacity-40 blur-[0.5px]">
          <div className="space-y-4">
            <div className="h-8 bg-white/60 rounded-lg w-3/4" />
            <div className="h-10 bg-white/60 rounded-xl w-full" />
            <div className="h-10 bg-white/60 rounded-xl w-full" />
            <div className="h-12 bg-primary/60 rounded-xl w-full" />
          </div>
        </div>

        {/* Logo Flutuante Superior */}
        <div className="relative z-20">
          <div className="bg-white/90 backdrop-blur-md w-16 h-16 rounded-xl p-3 shadow-sm border border-white/60 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-primary">
              <img src="/favicon_2.png" alt="" />
              <span className="text-[8px] font-bold tracking-tight text-[#1a1b22] mt-0.5">InRumo</span>
            </div>
          </div>
        </div>

        {/* Mensagem Institucional */}
        <div className="relative z-20 max-w-lg mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Junta-te ao INSTIC</span>
          </div>
          <h1 className="font-heading text-4xl xl:text-[42px] leading-[1.15] font-bold text-[#1a1b22] tracking-tight mb-4">
            Começa a construir a tua jornada.
          </h1>
          <p className="font-body text-base text-[#504536] leading-relaxed max-w-md">
            Seja para descobrir qual a engenharia ideal para o teu perfil ou para impulsionar a tua carreira académica no INSTIC, estamos aqui para orientar a tua escolha.
          </p>
        </div>
      </div>

      {/* ================= LADO DIREITO: Seleção de Perfil ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-7">

          {/* Topo Mobile (Logo) */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
             <img src="/favicon_2.png" alt="" />
            <span className="font-heading text-xl font-bold text-[#1a1b22]">InRumo</span>
          </div>

          {/* Cabeçalho */}
          <div>
            <h2 className="font-heading text-2xl sm:text-[28px] font-bold text-[#1a1b22] tracking-tight">
              Criar conta
            </h2>
            <p className="font-body text-sm text-[#504536] mt-1.5">
              Como te descreves neste momento? Seleciona a opção que melhor se ajusta a ti.
            </p>
          </div>

          {/* Lista de Opções de Perfil */}
          <div className="space-y-4">

            {/* Opção 1: Candidato / Futuro Estudante */}
            <button
              type="button"
              onClick={() => navigate('/register/candidate')}
              className="w-full bg-white hover:bg-surface-container-lowest border-2 border-primary/30 hover:border-primary p-5 rounded-2xl text-left transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm sm:text-base text-[#1a1b22] group-hover:text-primary transition-colors">
                      Ainda não estou matriculado
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-body-sm text-xs text-[#504536] leading-relaxed">
                    Quero fazer o teste vocacional inteligente e descobrir o curso ideal no INSTIC para o meu perfil.
                  </p>
                </div>
              </div>
            </button>

            {/* Opção 2: Estudante Matriculado no INSTIC */}
            <button
              type="button"
              onClick={() => navigate('/register/matriculado')}
              className="w-full bg-white hover:bg-surface-container-lowest border border-[#e8e7f1] hover:border-tertiary p-5 rounded-2xl text-left transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm sm:text-base text-[#1a1b22] group-hover:text-tertiary transition-colors">
                      Já sou aluno do INSTIC
                    </span>
                    <ArrowRight className="w-4 h-4 text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-body-sm text-xs text-[#504536] leading-relaxed">
                    Aceder ao orientador de IA 24/7, agendar mentoria com professores e explorar áreas de especialização.
                  </p>
                </div>
              </div>
            </button>

          </div>

          {/* Rodapé / Link de Login */}
          <p className="text-center text-xs text-[#504536] pt-3">
            Já tens uma conta ativa?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Iniciar sessão
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}