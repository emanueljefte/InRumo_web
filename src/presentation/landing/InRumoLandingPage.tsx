import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  GraduationCap,
  ArrowRight,
  Landmark,
  FlaskConical,
  Users,
  Menu,
  X,
  BarChart3,
  Radio,
  Code2,
  Target,
  Sparkles,
  Compass,
  MessageCircle,
  Check,
  CheckCircle2,
  Award,
  Cpu,
  Building2,
  ShieldCheck,
  Clock,
  Sliders,
  Brain,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import FaqSection from '../../components/FaqSection';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../../application/auth/useAuth';
import { getHomeRoute } from '../../application/auth/getHomeRoute';

export default function InRumoLandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace('#', '');
    // pequeno delay para garantir que o conteúdo já está montado no DOM
    const timeout = setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.hash]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      if (heroContentRef.current) {
        gsap.from(heroContentRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      gsap.from(heroCardRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.3,
      });

      if (floatingBadgeRef.current) {
        gsap.fromTo(
          floatingBadgeRef.current,
          { y: 0 },
          {
            y: -6,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }
        );
      }

      gsap.from(logosRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.6,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">

      {/* TopNavBar */}
      <header
        ref={headerRef}
        className="bg-background/80 backdrop-blur-xl border-b border-outline-variant/40 sticky top-0 z-50 transition-all"
      >
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center h-20">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
            <img src="/favicon_2.png" alt="Logo do InRumo" className="h-9 w-auto object-contain" />
            <span className="font-heading font-bold text-xl tracking-tight text-on-surface">
              In<span className="text-primary">Rumo</span>
            </span>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              href="#cursos"
            >
              Cursos
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              href="#metodologia"
            >
              Metodologia
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary hover:after:w-full after:transition-all"
              href="#sobre"
            >
              O INSTIC
            </a>
          </nav>

          {/* Ações Desktop */}

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="hidden md:block font-body-sm text-xs text-on-surface-variant">{profile?.nome}</span>
                <button onClick={() => navigate(getHomeRoute(profile))} className="bg-primary-container text-on-primary-container font-body-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer">
                  Voltar ao painel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-primary px-3 py-2 transition-colors cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/test')}
                  className="bg-primary text-on-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Começar Teste</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Botão Menu Mobile */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
                  aria-label="Abrir menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Drawer Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-surface-container-lowest shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="/favicon_2.png" alt="Logo do InRumo" className="h-8" />
                  <span className="font-heading font-bold text-lg">InRumo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 pt-4">
                <a
                  href="#cursos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-on-surface hover:text-primary px-3 py-2.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  Cursos
                </a>
                <a
                  href="#metodologia"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-on-surface hover:text-primary px-3 py-2.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  Metodologia
                </a>
                <a
                  href="#sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-on-surface hover:text-primary px-3 py-2.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  O INSTIC
                </a>
              </nav>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              {session ? (
                <button onClick={() => { setMobileMenuOpen(false); navigate(getHomeRoute(profile)); }} className="bg-primary-container text-on-primary-container font-semibold px-5 py-3 rounded-lg">
                  Voltar ao painel
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full text-center text-sm font-medium text-on-surface border border-outline-variant px-4 py-2.5 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    Entrar na Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); navigate('/register/matriculado'); }}
                    className="w-full text-center text-xs font-semibold text-primary hover:underline py-1"
                  >
                    Já sou aluno matriculado
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); navigate('/test'); }}
                    className="w-full bg-primary text-on-primary text-sm font-semibold px-5 py-3 rounded-xl shadow-xs hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
                  >
                    <span>Começar Teste Grátis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="grow">
        {/* Hero Section */}
        <section className="relative w-full pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">

          {/* Luzes / Background Glow */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="grid md:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Lado Esquerdo: Mensagem e Ação */}
              <div ref={heroContentRef} className="md:col-span-7 space-y-6 text-left">

                {/* Badge Superior */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary tracking-wide">
                    Orientação Vocacional para o INSTIC
                  </span>
                </div>

                {/* Título Principal */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] lg:leading-[1.15] text-on-surface font-extrabold tracking-tight">
                  Descubra o curso ideal para o seu perfil no{' '}
                  <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent inline-block">
                    INSTIC
                  </span>
                </h1>

                {/* Subtítulo */}
                <p className="font-body-md text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
                  Avalie suas aptidões lógicas, científicas e tecnológicas. Receba um diagnóstico preciso sobre qual Engenharia ou Licenciatura melhor combina com o seu futuro.
                </p>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/test')}
                    className="bg-primary text-on-primary font-semibold px-7 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center gap-2.5 group active:scale-[0.98] cursor-pointer"
                  >
                    <span>Iniciar Teste Gratuito</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/course')}
                    className="bg-surface-container-lowest border border-outline-variant hover:border-primary text-on-surface font-medium px-6 py-4 rounded-2xl hover:bg-surface-container transition-all flex justify-center items-center cursor-pointer shadow-2xs"
                  >
                    Ver Cursos Disponíveis
                  </button>
                </div>

                {/* Prova Social / Estatísticas */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-outline-variant/40 max-w-lg">
                  <div>
                    <p className="text-2xl font-bold font-heading text-on-surface">100%</p>
                    <p className="text-xs text-on-surface-variant">Alinhado ao INSTIC</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-heading text-primary">10 min</p>
                    <p className="text-xs text-on-surface-variant">Duração do teste</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-heading text-on-surface">Directo</p>
                    <p className="text-xs text-on-surface-variant">Relatório Imediato</p>
                  </div>
                </div>

              </div>

              {/* Lado Direito: Mockup Interativo da Interface (Substitui foto stock genérica) */}
              <div className="md:col-span-5 relative">
                <div
                  ref={heroCardRef}
                  className="relative rounded-3xl p-5 bg-surface-container-lowest/90 border border-outline-variant/80 shadow-2xl backdrop-blur-xl space-y-5"
                >

                  {/* Cabeçalho do Card Mockup */}
                  <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                        CP
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Resultado Vocacional</p>
                        <p className="text-[11px] text-on-surface-variant">Candidato: Estudante INSTIC</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Concluído
                    </span>
                  </div>

                  {/* Card do Curso Recomendado #1 */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Melhor Correspondência</span>
                        <h4 className="text-base font-bold text-on-surface mt-0.5">Engenharia Informática</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-primary font-heading">96%</span>
                        <p className="text-[10px] text-on-surface-variant">Aptidão</p>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[96%]" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1">
                      <span>Perfil: Analítico & Sistemas</span>
                      <span className="font-semibold text-primary">INSTIC Luanda</span>
                    </div>
                  </div>

                  {/* Outras Opções de Compatibilidade */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Outras Alternativas Altas</p>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/30 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-on-surface">Engenharia de Telecomunicações</span>
                      </div>
                      <span className="font-bold text-on-surface">88%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container/60 hover:bg-surface-container transition-colors border border-outline-variant/30 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <BarChart3 className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-on-surface">Informática de Gestão</span>
                      </div>
                      <span className="font-bold text-on-surface">82%</span>
                    </div>
                  </div>

                  {/* Badge Flutuante no Canto do Card */}
                  <div
                    ref={floatingBadgeRef}
                    className="absolute -bottom-4 -right-4 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/80 shadow-xl flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Algoritmo INSTIC</p>
                      <p className="text-[10px] text-on-surface-variant">Baseado na Matriz Curricular</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- SECÇÃO: SOBRE O INSTIC --- */}
        <section id="sobre" className="py-24 px-3 scroll-mt-20 bg-surface-container-lowest border-t border-outline-variant/40 relative overflow-hidden">
          {/* Glow sutil de fundo */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg grid md:grid-cols-12 gap-12 items-center relative z-10">

            {/* Coluna de Conteúdo */}
            <div className="md:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>O INSTIC</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
                Formando os Líderes da <span className="text-primary">Era Digital</span>
              </h2>

              <p className="font-body-md text-on-surface-variant leading-relaxed text-sm sm:text-base">
                O Instituto Superior de Tecnologias de Informação e Comunicação (INSTIC) é uma instituição pública de referência em Angola. Capacitamos jovens talentos com competências técnicas e científicas rigorosas para liderar a transformação digital no mercado nacional e global.
              </p>

              {/* Cards de Estatísticas Otimizados */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                {[
                  { value: '1.500+', label: 'Estudantes', icon: Users },
                  { value: '3', label: 'Engenharias', icon: GraduationCap },
                  { value: '10+', label: 'Anos de História', icon: Award },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/50 hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300"
                  >
                    <stat.icon className="w-4 h-4 text-primary mb-2 opacity-80" />
                    <p className="font-heading text-xl sm:text-2xl font-black text-on-surface tracking-tight">{stat.value}</p>
                    <p className="font-body-sm text-on-surface-variant text-[11px] font-medium leading-tight mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna Visual (Imagem com Card de Vidro) */}
            <div className="md:col-span-6">
              <div className="relative group rounded-3xl overflow-hidden border border-outline-variant/60 shadow-xl bg-surface-container">

                {/* Aspect Ratio 16:9 Imagem */}
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
                    alt="Campus e ambiente académico do INSTIC"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Glassmorphism Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide">Campus & Laboratórios de Alta Tecnologia</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded-md">Luanda</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- SECÇÃO: CATÁLOGO DE CURSOS --- */}
        <section id="cursos" className="py-24 px-3 scroll-mt-20 bg-background relative">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg">

            {/* Cabeçalho da Secção */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/40 text-on-tertiary-container border border-tertiary/20 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                <span>Catálogo de Cursos</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Três caminhos, um só destino: <span className="text-primary">o teu futuro</span>
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto">
                Conheça as licenciaturas oferecidas no INSTIC projetadas para responder às exigências do mercado global de tecnologia.
              </p>
            </div>

            {/* Grelha de Cards de Cursos */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: 'Engenharia Informática',
                  tag: 'Software & Cloud',
                  desc: 'Desenvolvimento de software, inteligência artificial e infraestruturas digitais para os desafios tecnológicos de amanhã.',
                  icon: Code2,
                  color: 'from-blue-500/10 to-transparent',
                },
                {
                  title: 'Engenharia de Telecomunicações',
                  tag: 'Redes & 5G',
                  desc: 'Sistemas de comunicação, redes corporativas e infraestruturas que conectam pessoas, dados e dispositivos no mundo todo.',
                  icon: Radio,
                  color: 'from-purple-500/10 to-transparent',
                },
                {
                  title: 'Informática de Gestão',
                  tag: 'Business & Tech',
                  desc: 'Tecnologia aplicada à gestão empresarial — sistemas de informação, inteligência de negócio e análise de processos.',
                  icon: BarChart3,
                  color: 'from-amber-500/10 to-transparent',
                },
              ].map((course) => (
                <div
                  key={course.title}
                  onClick={() => navigate(`/course/${course.title}`)}
                  className="group relative bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-7 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle Hover Gradient Background */}
                  <div className={`absolute top-0 left-0 right-0 h-32 bg-linear-to-b ${course.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10 space-y-4">
                    {/* Header do Card (Ícone + Tag) */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-surface transition-all duration-300 shadow-sm">
                        <course.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/30">
                        {course.tag}
                      </span>
                    </div>

                    {/* Conteúdo */}
                    <div>
                      <h3 className="font-heading text-xl font-bold text-on-surface group-hover:text-primary transition-colors duration-200">
                        {course.title}
                      </h3>
                      <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-2.5">
                        {course.desc}
                      </p>
                    </div>
                  </div>

                  {/* Footer do Card (Link com Seta Animada) */}
                  <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center justify-between text-xs font-semibold text-primary relative z-10">
                    <span>Explorar Matriz Curricular</span>
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-surface transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Secundário de Ação */}
            {/* <div className="text-center mt-12">
              <button
                onClick={() => navigate('/course')}
                className="inline-flex items-center gap-2 font-medium text-xs sm:text-sm text-on-surface bg-surface-container-low border border-outline-variant/70 hover:border-primary hover:bg-surface-container px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
              >
                <span>Ver matrizes curriculares completas</span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div> */}

          </div>
        </section>

        {/* --- SECÇÃO: PROVA INSTITUCIONAL / ECOSSISTEMA --- */}
        <section className="py-16 px-3 bg-surface-container-lowest border-t border-b border-outline-variant/40 relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg text-center relative z-10">

            <p className="font-body-sm text-[11px] sm:text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mb-10">
              Avaliados e validados pelo ecossistema acadêmico
            </p>

            <div
              ref={logosRef}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto"
            >
              {[
                { name: 'INSTIC', subtitle: 'Direção Académica', icon: Landmark, primary: true },
                { name: 'TechLab IN', subtitle: 'Centro de Investigação', icon: FlaskConical, primary: false },
                { name: 'Assoc. Estudantes', subtitle: 'Representação Discente', icon: Users, primary: false },
              ].map((partner) => (
                <div
                  key={partner.name}
                  className={`flex items-center justify-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-default group ${partner.primary
                    ? 'bg-primary/5 border-primary/30 shadow-sm hover:border-primary/60'
                    : 'bg-surface-container-low/50 border-outline-variant/40 hover:bg-surface-container-low hover:border-outline-variant/80'
                    }`}
                >
                  <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${partner.primary ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant group-hover:text-primary'
                    }`}>
                    <partner.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-heading text-base font-bold text-on-surface tracking-tight leading-none group-hover:text-primary transition-colors">
                      {partner.name}
                    </h4>
                    <span className="text-[11px] font-medium text-on-surface-variant/80 mt-1 block">
                      {partner.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* --- SECÇÃO: CALL TO ACTION (BANNER HERO) --- */}
        <section className="py-20 px-3 bg-background relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg">

            {/* Banner Container com Efeito Glow */}
            <div className="relative rounded-3xl bg-linear-to-br from-primary/10 via-surface-container-lowest to-tertiary/10 border border-outline-variant/60 p-8 sm:p-12 md:p-16 text-center shadow-2xl overflow-hidden">

              {/* Luzes / Blur de Fundo Decorativo */}
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-tertiary/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">

                {/* Chips de Destaque Rápido */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest/80 text-on-surface text-[11px] font-semibold border border-outline-variant/40">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>~8 a 10 Minutos</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest/80 text-on-surface text-[11px] font-semibold border border-outline-variant/40">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Sem Necessidade de Registo Prévio</span>
                  </span>
                </div>

                {/* Título e Subtítulo */}
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-tight">
                  Pronto para descobrir o <span className="text-primary">teu caminho?</span>
                </h2>

                <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                  Descobre a tua taxa de compatibilidade real com as Engenharias e Tecnologias do INSTIC através da nossa avaliação guiada por inteligência artificial.
                </p>

                {/* Botão de Ação Destacado */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/test')}
                    className="w-full sm:w-auto bg-primary text-on-primary font-bold text-sm sm:text-base px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25 inline-flex items-center justify-center gap-3 group active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Começar Teste Vocacional Grátis</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* --- SECÇÃO: ESTUDANTES MATRICULADOS --- */}
        <section id="matriculados" className="py-24 px-3 scroll-mt-20 bg-surface-container-low/40 border-t border-b border-outline-variant/40 relative overflow-hidden">
          {/* Glow decorativo suave */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg relative z-10">
            <div className="grid md:grid-cols-12 gap-12 items-center">

              {/* Conteúdo Principal */}
              <div className="md:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-semibold uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Exclusivo para Alunos INSTIC</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
                  Já estás matriculado? <br className="hidden sm:inline" />
                  <span className="text-primary">O InRumo também é para ti.</span>
                </h2>

                <p className="font-body-md text-on-surface-variant leading-relaxed text-sm sm:text-base max-w-xl">
                  Escolher o curso é apenas o ponto de partida. Quer estejas em Engenharia Informática, Telecomunicações ou Informática de Gestão, ajudamos-te a escolher a tua área de especialização e plano de carreira ideal.
                </p>

                {/* Lista de Vantagens Otimizada */}
                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  {[
                    'Teste vocacional de especialização interna',
                    'Orientador IA 24/7 com contexto do curso',
                    'Agendamento direto com mentores humanos',
                    'Partilha segura de portfólios e documentos',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container-lowest/60 border border-outline-variant/30">
                      <div className="w-5 h-5 rounded-full bg-tertiary/15 flex items-center justify-center text-tertiary shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-body-sm text-xs sm:text-sm text-on-surface font-medium leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate('/register/matriculado')}
                    className="bg-tertiary text-on-tertiary font-bold text-sm px-7 py-3.5 rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-tertiary/20 inline-flex items-center gap-2.5 group active:scale-95 cursor-pointer"
                  >
                    <span>Sou Aluno do INSTIC — Entrar Agora</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Card Visual de Orientação Simulado */}
              <div className="md:col-span-5">
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 p-6 sm:p-7 shadow-xl space-y-5 relative">

                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary font-bold">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-on-surface text-sm">Hub do Estudante</h4>
                        <p className="text-[11px] text-on-surface-variant font-medium">Acompanhamento Académico</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo
                    </span>
                  </div>

                  {/* Item Simulado 1 */}
                  <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Users className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-on-surface text-xs sm:text-sm">Orientação Contínua</p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">Do 1º ano até ao Projeto Final de Curso</p>
                    </div>
                  </div>

                  {/* Item Simulado 2 */}
                  <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                      <MessageCircle className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-on-surface text-xs sm:text-sm">Modelo Híbrido (IA + Mentor)</p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">Respostas rápidas por IA com validação de professores</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- SECÇÃO: METODOLOGIA (ALINHADA AO TESTE ADAPTATIVO) --- */}
        <section id="metodologia" className="py-24 px-3 scroll-mt-20 bg-background relative">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg">

            {/* Cabeçalho */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5" />
                <span>Engenharia Vocacional</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Como calculamos o teu <span className="text-primary">Match Ideal?</span>
              </h2>

              <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto">
                Substituímos os testes tradicionais por um motor dinâmico que analisa competências técnicas, raciocínio e perfil comportamental em tempo real.
              </p>
            </div>

            {/* Cards de Metodologia */}
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: 'Algoritmo Adaptativo CAT',
                  subtitle: 'Perguntas Dinâmicas',
                  desc: 'As perguntas ajustam-se às tuas respostas anteriores. Se demonstrares facilidade em lógica, o teste avança para validar o teu nível de profundidade técnica.',
                  icon: Compass,
                  badge: 'Item Response Theory',
                },
                {
                  title: 'Perfis RIASEC & Big Five',
                  subtitle: 'Psicometria Aplicada',
                  desc: 'Cruzamento das 6 dimensões de Holland com os 5 traços de personalidade para mapear não só o que gostas, mas em que ambiente de trabalho produzes melhor.',
                  icon: Sliders,
                  badge: 'Modelo Validador',
                },
                {
                  title: 'Motor de Match em Tempo Real',
                  subtitle: 'Matriz INSTIC',
                  desc: 'Comparação instantânea do teu perfil cognitivo com os requisitos reais dos cursos de Engenharia Informática, Telecomunicações e Gestão.',
                  icon: Target,
                  badge: 'IA Predictive Fit',
                },
              ].map((method) => (
                <div
                  key={method.title}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-7 hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <method.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                        {method.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider block mb-1">
                        {method.subtitle}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-2">
                        {method.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
        <FaqSection />
      </main>

      {/* Footer */}
      {/* --- SECÇÃO: RODAPÉ (FOOTER) --- */}
      <footer className="px-3 bg-surface-container-lowest border-t border-outline-variant/40 relative overflow-hidden">
        {/* Gradiente de luz subtil no fundo */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-32 bg-primary/5 blur-3xl pointer-events-none" />

        <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg pt-16 pb-12 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-14">

            {/* Coluna 1: Logo, Descrição e Badge de Status (5 colunas) */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon_2.png"
                  alt="Logo do InRumo"
                  className="h-9 w-auto object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                  Plataforma Oficial INSTIC
                </span>
              </div>

              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed">
                Plataforma de orientação vocacional inteligente do Instituto Superior de Tecnologias de Informação e Comunicação. Ajudamos estudantes a tomar decisões de carreira embasadas em ciência psicométrica.
              </p>

              {/* Indicador de Status do Sistema */}
              <div className="inline-flex items-center gap-2 text-[11px] text-on-surface-variant/80 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Plataforma ativa para o ano académico 2026</span>
              </div>
            </div>

            {/* Coluna 2: Navegação (3 colunas) */}
            <div className="md:col-span-3 space-y-4">
              <p className="font-heading text-xs font-bold text-on-surface uppercase tracking-wider">
                Navegação Rápida
              </p>
              <ul className="space-y-2.5 font-body-sm text-xs sm:text-sm">
                {[
                  { label: 'Cursos & Licenciaturas', href: '#cursos' },
                  { label: 'Metodologia Vocacional', href: '#metodologia' },
                  { label: 'Sobre o INSTIC', href: '#sobre' },
                  { label: 'Estudantes Matriculados', href: '#matriculados' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-on-surface-variant hover:text-primary transition-colors duration-200 block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3: Informações Legais & Contacto (4 colunas) */}
            <div className="md:col-span-4 space-y-4">
              <p className="font-heading text-xs font-bold text-on-surface uppercase tracking-wider">
                Legal & Contacto
              </p>
              <ul className="space-y-2.5 font-body-sm text-xs sm:text-sm">
                <li>
                  <a href="/privacidade" className="text-on-surface-variant hover:text-primary transition-colors duration-200 block py-0.5">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="/termos" className="text-on-surface-variant hover:text-primary transition-colors duration-200 block py-0.5">
                    Termos e Condições de Uso
                  </a>
                </li>
                <li className="pt-2">
                  <span className="text-[11px] font-semibold text-on-surface-variant/70 uppercase block mb-1">
                    Atendimento Académico
                  </span>
                  <a
                    href="mailto:contacto@instic.ao"
                    className="font-mono text-xs text-primary hover:underline font-medium"
                  >
                    contacto@instic.ao
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Linha Inferior: Copyright e Redes Sociais */}
          <div className="pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-6">

            <p className="font-body-sm text-xs text-on-surface-variant/80 text-center sm:text-left">
              © 2026 InRumo — Desenvolvido para o <strong className="text-on-surface font-semibold">INSTIC</strong>. Todos os direitos reservados.
            </p>

            {/* Ícones das Redes Sociais */}
            <div className="flex items-center gap-2.5">
              {[
                { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com' },
                { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

          </div>

        </div>
      </footer>
    </div>
  );
};