import type { MatriculadoQuestion } from "../../domain/test/MatriculadoQuestion";

export const MATRICULADO_QUESTION_BANK: MatriculadoQuestion[] = [
  // LIKERT
  // Bloco A — Desempenho (não conta para o cálculo)
  { id: 'des-01', type: 'likert', categoria: 'Desempenho', enunciado: 'Tenho disciplinas de que gosto claramente mais do que outras.' },
  { id: 'des-02', type: 'likert', categoria: 'Desempenho', enunciado: 'Costumo ter melhor desempenho nalgumas disciplinas específicas.' },
  { id: 'des-03', type: 'likert', categoria: 'Desempenho', enunciado: 'Há disciplinas que me exigem mais esforço do que outras.' },
  { id: 'des-04', type: 'likert', categoria: 'Desempenho', enunciado: 'Realizo trabalhos académicos com mais entusiasmo quando envolvem programação, redes, sistemas, análise de dados, gestão ou investigação.' },
  { id: 'des-05', type: 'likert', categoria: 'Desempenho', enunciado: 'Há uma disciplina que faria mesmo que não fosse obrigatória.' },
  { id: 'des-06', type: 'likert', categoria: 'Desempenho', enunciado: 'Há projetos em que perco a noção do tempo por estar completamente envolvido.' },

  // Bloco B — Competências (não conta para o cálculo)
  { id: 'comp-01', type: 'likert', categoria: 'Competências', enunciado: 'Considero-me forte em programação, análise, comunicação, resolução de problemas, gestão ou organização.' },
  { id: 'comp-02', type: 'likert', categoria: 'Competências', enunciado: 'Tenho facilidade em encontrar erros num sistema ou programa.' },
  { id: 'comp-03', type: 'likert', categoria: 'Competências', enunciado: 'Gosto de analisar grandes quantidades de informação.' },
  { id: 'comp-04', type: 'likert', categoria: 'Competências', enunciado: 'Tenho facilidade em explicar assuntos tecnológicos a pessoas fora da área.' },
  { id: 'comp-05',type: 'likert',  categoria: 'Competências', enunciado: 'Gosto de trabalhar sozinho quando preciso de concentração.' },
  { id: 'comp-06', type: 'likert', categoria: 'Competências', enunciado: 'Prefiro trabalhar em equipa.' },
  { id: 'comp-07', type: 'likert', categoria: 'Competências', enunciado: 'Sinto-me confortável a liderar projetos.' },
  { id: 'comp-08', type: 'likert', categoria: 'Competências', enunciado: 'Tenho facilidade para aprender novas tecnologias.' },

  // Bloco C — Informática (áreas)
  { id: 'inf-01', type: 'likert', categoria: 'Área', areaId: 'dev-software', enunciado: 'Prefiro construir sistemas novos a analisar sistemas já existentes.' },
  { id: 'inf-02', type: 'likert', categoria: 'Área', areaId: 'eng-software', enunciado: 'Gosto de analisar sistemas existentes para os melhorar e organizar melhor.' }, // adição
  { id: 'inf-03', type: 'likert', categoria: 'Área', areaId: 'dev-software', enunciado: 'Gosto mais de escrever código do que de analisar dados.' },
  { id: 'inf-04', type: 'likert', categoria: 'Área', areaId: 'ciencia-dados', enunciado: 'Gosto mais de analisar dados do que de escrever código.' },
  { id: 'inf-05', type: 'likert', categoria: 'Área', areaId: 'ia', enunciado: 'Tenho interesse em inteligência artificial.' },
  { id: 'inf-06', type: 'likert', categoria: 'Área', areaId: 'ciberseguranca', enunciado: 'Tenho curiosidade sobre segurança digital e proteção de sistemas.' },
  { id: 'inf-07', type: 'likert', categoria: 'Área', areaId: 'dev-web-mobile', enunciado: 'Gostaria de desenvolver aplicações para computadores ou dispositivos móveis.' },
  { id: 'inf-08', type: 'likert', categoria: 'Área', areaId: 'bases-dados', enunciado: 'Tenho interesse em organizar e estruturar grandes volumes de dados armazenados.' }, // adição
  { id: 'inf-09',type: 'likert',  categoria: 'Área', areaId: 'sistemas-infraestrutura', enunciado: 'Tenho interesse em manter sistemas e servidores a funcionar de forma estável.' }, // adição

  // Bloco C — Telecomunicações (áreas)
  { id: 'tel-01', type: 'likert', categoria: 'Área', areaId: 'redes-computadores', enunciado: 'Tenho interesse por redes de computadores.' },
  { id: 'tel-02', type: 'likert', categoria: 'Área', areaId: 'redes-computadores', enunciado: 'Gosto de compreender como os dispositivos comunicam entre si.' },
  { id: 'tel-03', type: 'likert', categoria: 'Área', areaId: 'redes-moveis', enunciado: 'Tenho interesse por redes móveis e tecnologias 4G/5G e posteriores.' },
  { id: 'tel-04', type: 'likert', categoria: 'Área', areaId: 'fibra-otica', enunciado: 'Gostaria de trabalhar com fibra ótica.' },
  { id: 'tel-05', type: 'likert', categoria: 'Área', areaId: 'comunicacao-satelite', enunciado: 'Tenho interesse em sistemas de transmissão e comunicação.' },
  { id: 'tel-06', type: 'likert', categoria: 'Área', areaId: 'infraestrutura-telecom', enunciado: 'Gosto de trabalhar com equipamentos e infraestruturas tecnológicas.' },
  { id: 'tel-07', type: 'likert', categoria: 'Área', areaId: 'redes-moveis', enunciado: 'Tenho interesse em redes sem fio, radiofrequência ou sistemas de comunicação.' },
  { id: 'tel-08', type: 'likert', categoria: 'Área', areaId: 'seguranca-redes', enunciado: 'Tenho interesse em proteger redes contra acessos não autorizados.' }, // adição

  // Bloco C — Informática de Gestão (áreas)
  { id: 'ges-01', type: 'likert', categoria: 'Área', areaId: 'sistemas-informacao', enunciado: 'Gosto de compreender como uma empresa funciona.' },
  { id: 'ges-02', type: 'likert', categoria: 'Área', areaId: 'sistemas-informacao', enunciado: 'Tenho interesse em sistemas de informação empresariais.' },
  { id: 'ges-03', type: 'likert', categoria: 'Área', areaId: 'business-intelligence', enunciado: 'Gosto de transformar dados em informação para apoiar decisões.' },
  { id: 'ges-04', type: 'likert', categoria: 'Área', areaId: 'gestao-projetos-ti', enunciado: 'Tenho interesse por gestão de projetos tecnológicos.' },
  { id: 'ges-05', type: 'likert', categoria: 'Área', areaId: 'processos-organizacionais', enunciado: 'Gosto de analisar processos e encontrar formas de os tornar mais eficientes.' },
  { id: 'ges-06', type: 'likert', categoria: 'Área', areaId: 'consultoria-tecnologica', enunciado: 'Consigo imaginar-me a trabalhar entre profissionais de tecnologia e gestores.' },
  { id: 'ges-07', type: 'likert', categoria: 'Área', areaId: 'empreendedorismo-digital', enunciado: 'Tenho interesse em empreendedorismo tecnológico.' },

  // SCENARIO
  {
    id: 'inf-scenario-01', type: 'scenario', categoria: 'Área',
    enunciado: 'A equipa encontrou um erro crítico em produção, na véspera de uma entrega. O que farias primeiro?',
    opcoes: [
      { id: 'a', texto: 'Investigar o código e corrigir o bug directamente', areaId: 'dev-software' },
      { id: 'b', texto: 'Analisar os dados de log para perceber o padrão do erro', areaId: 'ciencia-dados' },
      { id: 'c', texto: 'Verificar se há uma falha de segurança por trás do erro', areaId: 'ciberseguranca' },
      { id: 'd', texto: 'Rever a arquitectura do sistema para evitar isto no futuro', areaId: 'eng-software' },
    ],
  },

  // RANKING
  {
    id: 'inf-ranking-01', type: 'ranking', categoria: 'Área',
    enunciado: 'Ordena estas actividades da que mais gostas para a que menos gostas.',
    itens: [
      { id: 'r1', texto: 'Construir uma aplicação do zero', areaId: 'dev-web-mobile' },
      { id: 'r2', texto: 'Treinar um modelo de IA', areaId: 'ia' },
      { id: 'r3', texto: 'Configurar servidores e infraestrutura', areaId: 'sistemas-infraestrutura' },
      { id: 'r4', texto: 'Organizar uma base de dados grande', areaId: 'bases-dados' },
    ],
  },

  // SWIPE
  {
    id: 'inf-swipe-01', type: 'swipe', categoria: 'Área', areaId: 'ciberseguranca',
    enunciado: 'Gosto de pensar como um atacante para descobrir falhas antes que aconteçam.',
  },
];