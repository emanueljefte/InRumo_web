import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  GraduationCap,
  ArrowRight,
  Brain,
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FaqSection from '../../components/FaqSection';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function InRumoLandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header
        ref={headerRef}
        className="bg-background/90 backdrop-blur-md border-b border-outline-variant/60 sticky top-0 z-50 px-4"
      >
        <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/">
              <img src='/favicon_2.png' alt='Logo do InRumo' />
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
              href="#cursos"
            >
              Cursos
            </a>
            <a
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
              href="#metodologia"
            >
              Metodologia
            </a>
            <a
              className="font-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
              href="#sobre"
            >
              O INSTIC
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="hidden md:block font-body-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/test')}
              className="bg-primary-container text-on-primary-container font-body-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              Começar Teste
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-on-surface"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-surface-container-lowest shadow-lg p-6 flex flex-col gap-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center">
              <img src="/favicon_2.png" alt="Logo do InRumo" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu">
                <X className="w-5 h-5 text-on-surface" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <a href="#cursos" onClick={() => setMobileMenuOpen(false)} className="font-body-md text-on-surface font-medium">
                Cursos
              </a>
              <a href="#metodologia" onClick={() => setMobileMenuOpen(false)} className="font-body-md text-on-surface font-medium">
                Metodologia
              </a>
              <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="font-body-md text-on-surface font-medium">
                O INSTIC
              </a>
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="border font-medium px-5 py-3 rounded-lg"
              >
                Entrar
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/test'); }}
                className="bg-primary-container text-on-primary-container font-semibold px-5 py-3 rounded-lg"
              >
                Começar Teste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="grow px-4">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:pt-20 md:pb-28 overflow-hidden">
          {/* Subtle Glow Background Accent */}
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary-container/15 rounded-full blur-3xl pointer-events-none transform -translate-y-1/2" />

          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg relative z-10">
            <div className="grid md:grid-cols-12 gap-gutter items-center">
              {/* Lado Esquerdo - Texto */}
              <div ref={heroContentRef} className="md:col-span-7 space-y-6">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/60 border border-primary">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <span className="font-body-sm text-on-surface-variant text-xs font-medium">
                    Orientação Vocacional INSTIC
                  </span>
                </div>

                {/* Título Principal */}
                <h1 className="font-heading text-display-lg md:text-[52px] md:leading-15 text-on-surface max-w-xl font-bold tracking-tight">
                  Descubra hoje o seu futuro acadêmico no{' '}
                  <span className="text-primary block sm:inline">INSTIC</span>
                </h1>

                {/* Subtítulo */}
                <p className="font-body-md text-on-surface-variant max-w-lg leading-relaxed">
                  Um mapeamento cognitivo e comportamental avançado para alinhar
                  seus talentos naturais aos cursos de excelência do Instituto
                  de Tecnologias de Informação e Comunicação.
                </p>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => navigate('/test')}
                    className="bg-primary-container text-on-primary-container font-body-sm font-semibold px-6 py-3.5 rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm flex justify-center items-center gap-2 group active:scale-95 cursor-pointer"
                  >
                    Começar Teste Grátis
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => navigate('/course')}
                    className="border font-medium px-6 py-3.5 rounded-lg hover:bg-surface-container hover:border-primary transition-colors flex justify-center items-center cursor-pointer"
                  >
                    Ver Catálogo de Cursos
                  </button>
                </div>

                {/* Prova Social */}
                <div className="pt-4 flex items-center gap-3 text-body-sm text-on-surface-variant">
                  <div className="flex -space-x-2">
                    <img
                      className="w-7 h-7 rounded-full border-2 border-background object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Estudante"
                    />
                    <img
                      className="w-7 h-7 rounded-full border-2 border-background object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Estudante"
                    />
                    <img
                      className="w-7 h-7 rounded-full border-2 border-background object-cover"
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                      alt="Estudante"
                    />
                  </div>
                  <span className="text-xs font-medium">
                    Junte-se a +2.000 estudantes guiados
                  </span>
                </div>
              </div>

              {/* Lado Direito - Ilustração e Card */}
              <div className="md:col-span-5 mt-10 md:mt-0 relative">
                <div
                  ref={heroCardRef}
                  className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 shadow-sm"
                >
                  <img
                    className="w-full h-auto rounded-xl object-cover"
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                    alt="Infográfico 3D de Orientação Vocacional InRumo"
                  />

                  {/* Badge de Precisão Flutuante */}
                  <div
                    ref={floatingBadgeRef}
                    className="absolute -bottom-4 -left-4 bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/60 shadow-md flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-container/80 flex items-center justify-center text-on-primary-container shrink-0">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-body-sm text-xs font-bold text-on-surface">
                        Precisão Algorítmica
                      </p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        94% de alinhamento
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="py-20 bg-surface-container-lowest border-t border-outline-variant/50">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg grid md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-6">
              <span className="font-body-sm text-xs font-semibold text-primary uppercase tracking-widest">
                O INSTIC
              </span>
              <h2 className="font-heading text-headline-lg text-on-surface mt-2 mb-4">
                [Nome da Instituição] — [tagline institucional]
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
                [Texto institucional: história, missão e posicionamento da instituição.
                Substituir por conteúdo real fornecido pela Administração Académica.]
              </p>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '[N]+', label: 'Estudantes' },
                  { value: '[N]', label: 'Cursos' },
                  { value: '[N]+', label: 'Anos de história' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-headline-md text-primary">{stat.value}</p>
                    <p className="font-body-sm text-on-surface-variant text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="bg-surface-container rounded-2xl aspect-video flex items-center justify-center border border-outline-variant/60">
                <span className="font-body-sm text-on-surface-variant text-xs">[Imagem/vídeo institucional]</span>
              </div>
            </div>
          </div>
        </section>

        <section id="cursos" className="py-20">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-body-sm text-xs font-semibold text-primary uppercase tracking-widest">
                Catálogo de Cursos
              </span>
              <h2 className="font-heading text-headline-lg text-on-surface mt-2">
                Três caminhos, um só destino: o teu futuro
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-gutter">
              {[
                {
                  title: 'Engenharia Informática',
                  desc: 'Desenvolvimento de software, sistemas inteligentes e infraestruturas digitais para os desafios tecnológicos de amanhã.',
                  icon: Code2,
                },
                {
                  title: 'Engenharia de Telecomunicações',
                  desc: 'Redes, sistemas de comunicação e infraestruturas que conectam pessoas, dados e dispositivos em todo o mundo.',
                  icon: Radio,
                },
                {
                  title: 'Informática de Gestão',
                  desc: 'Tecnologia aplicada à gestão empresarial — sistemas de informação, análise de dados e processos de negócio.',
                  icon: BarChart3,
                },
              ].map((course) => (
                <div
                  key={course.title}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
                  onClick={() => navigate(`/course/${course.title}`)}
                >
                  <div className="w-11 h-11 rounded-lg bg-primary-container/70 flex items-center justify-center text-on-primary-container mb-4">
                    <course.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-headline-sm text-on-surface mb-2">{course.title}</h3>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">{course.desc}</p>
                  <span className="font-body-sm text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver detalhes <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button onClick={() => navigate('/course')} className="border font-medium px-6 py-3 rounded-lg hover:bg-surface-container hover:border-primary transition-colors">
                Ver catálogo completo
              </button>
            </div>
          </div>
        </section>

        {/* Institutional Proof Section */}
        <section className="py-16 bg-surface-container-lowest border-t border-outline-variant/50">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg text-center">
            <p className="font-body-sm text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest mb-8">
              Avaliados e validados pelo ecossistema acadêmico
            </p>

            <div
              ref={logosRef}
              className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-80"
            >
              <div className="flex items-center gap-2.5 text-on-surface hover:text-primary transition-colors cursor-default">
                <Landmark className="w-6 h-6 text-primary" />
                <span className="font-heading text-headline-sm font-bold tracking-tight">
                  INSTIC
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-default">
                <FlaskConical className="w-6 h-6" />
                <span className="font-heading text-headline-sm font-bold tracking-tight">
                  TechLab IN
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-on-surface-variant hover:text-on-surface transition-colors cursor-default">
                <Users className="w-6 h-6" />
                <span className="font-heading text-headline-sm font-bold tracking-tight">
                  Assoc. Estudantes
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary-container/10">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg text-center">
            <h2 className="font-heading text-headline-lg text-on-surface mb-4">
              Pronto para descobrir o teu caminho?
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-lg mx-auto mb-8">
              Leva menos de 10 minutos e não precisas de criar conta para veres o resultado.
            </p>
            <button
              onClick={() => navigate('/test')}
              className="bg-primary-container text-on-primary-container font-body-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm inline-flex items-center gap-2 group active:scale-95 cursor-pointer"
            >
              Começar Teste Grátis
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        <section id="metodologia" className="py-20">
          <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="font-body-sm text-xs font-semibold text-primary uppercase tracking-widest">
                Metodologia
              </span>
              <h2 className="font-heading text-headline-lg text-on-surface mt-2">
                Ciência comportamental aplicada à tua decisão
              </h2>
              <p className="font-body-md text-on-surface-variant mt-3">
                [Modelo — ajustar conforme os métodos realmente usados no teste vocacional]
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-gutter">
              {[
                {
                  title: 'Modelo RIASEC (Holland)',
                  desc: 'Classificação de interesses vocacionais em seis dimensões — Realista, Investigativo, Artístico, Social, Empreendedor, Convencional.',
                  icon: Compass,
                },
                {
                  title: 'Big Five (OCEAN)',
                  desc: 'Avaliação de traços de personalidade que influenciam a adaptação a diferentes ambientes académicos e profissionais.',
                  icon: Sparkles,
                },
                {
                  title: 'Análise de aptidões',
                  desc: 'Cruzamento de competências lógicas, verbais e técnicas com as exigências de cada curso e área de estudo.',
                  icon: Target,
                },
              ].map((method) => (
                <div key={method.title} className="p-6 rounded-2xl border border-outline-variant/60">
                  <div className="w-11 h-11 rounded-lg bg-tertiary-container/60 flex items-center justify-center text-on-primary-container mb-4">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-headline-sm text-on-surface mb-2">{method.title}</h3>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <FaqSection />
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-outline-variant/40">
        <div className="max-w-container-max mx-auto px-gutter md:px-stack-lg py-14">
          <div className="grid md:grid-cols-4 gap-gutter mb-10">
            <div className="md:col-span-2">
              <img src="/favicon_2.png" alt="Logo do InRumo" className="h-8 mb-4" />
              <p className="font-body-sm text-on-surface-variant max-w-xs leading-relaxed">
                Plataforma de orientação vocacional do INSTIC — ajudando estudantes a
                escolher o curso certo com base em ciência comportamental.
              </p>
            </div>

            <div>
              <p className="font-body-sm text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">
                Navegação
              </p>
              <ul className="flex flex-col gap-3">
                <li><a href="#cursos" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Cursos</a></li>
                <li><a href="#metodologia" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Metodologia</a></li>
                <li><a href="#sobre" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">O INSTIC</a></li>
              </ul>
            </div>

            <div>
              <p className="font-body-sm text-xs font-semibold text-on-surface uppercase tracking-widest mb-4">
                Legal
              </p>
              <ul className="flex flex-col gap-3">
                <li><a href="/privacidade" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="/termos" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="mailto:contacto@instic.ao" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body-sm text-xs text-on-surface-variant">
              © 2026 InRumo — Plataforma de Orientação Vocacional INSTIC. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="text-on-surface-variant hover:text-primary transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-on-surface-variant hover:text-primary transition-colors">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="text-on-surface-variant hover:text-primary transition-colors">
                <FaFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};