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
    id: 'ei-scenario-01', type: 'scenario', categoria: 'Área',
    enunciado: 'A equipa encontrou um erro crítico em produção, na véspera de uma entrega. O que farias primeiro?',
    opcoes: [
      { id: 'a', texto: 'Investigar o código e corrigir o bug directamente', areaId: 'dev-software' },
      { id: 'b', texto: 'Analisar os dados de log para perceber o padrão do erro', areaId: 'ciencia-dados' },
      { id: 'c', texto: 'Verificar se há uma falha de segurança por trás do erro', areaId: 'ciberseguranca' },
      { id: 'd', texto: 'Rever a arquitectura do sistema para evitar isto no futuro', areaId: 'eng-software' },
    ],
  },
  {
  id: 'et-scenario-02',
  type: 'scenario',
  categoria: 'Área',
  enunciado: 'Uma operadora de telecomunicações quer lançar um novo serviço de dados em Angola. Em qual destas etapas técnicas de telecomunicações gostarias de atuar?',
  opcoes: [
    { id: 'a', texto: 'Planear a expansão do sinal e a cobertura das antenas 4G/5G para novas províncias', areaId: 'redes-moveis' },
    { id: 'b', texto: 'Dimensionar a rede de fibra ótica de alta velocidade para interligar os centros de dados', areaId: 'fibra-otica' },
    { id: 'c', texto: 'Configurar a segurança da rede de comunicação contra acessos não autorizados', areaId: 'seguranca-redes' },
    { id: 'd', texto: 'Supervisionar a instalação e manutenção do equipamento físico nas estações base', areaId: 'infraestrutura-telecom' },
  ],
},
  {
  id: 'ei-scenario-04',
  type: 'scenario',
  categoria: 'Área',
  enunciado: 'Um grande banco sofreu uma interrupção inesperada nos seus serviços digitais. Qual destas abordagens tecnológicas te motivaria mais a resolver o problema?',
  opcoes: [
    { id: 'a', texto: 'Investigar se ocorreu uma tentativa de invasão ou ataque malicioso e blindar o sistema', areaId: 'ciberseguranca' },
    { id: 'b', texto: 'Analisar e otimizar as consultas ao banco de dados para eliminar lentidão nas transações', areaId: 'bases-dados' },
    { id: 'c', texto: 'Investigar o código-fonte da aplicação para encontrar e corrigir o erro de lógica', areaId: 'dev-software' },
    { id: 'd', texto: 'Reconfigurar a infraestrutura dos servidores e do ambiente operacional para restaurar o serviço', areaId: 'sistemas-infraestrutura' },
  ],
},
  {
  id: 'ig-scenario-03',
  type: 'scenario',
  categoria: 'Área',
  enunciado: 'Uma startup quer lançar uma plataforma inovadora no mercado angolano. Qual seria a tua principal contribuição na vertente de gestão e negócio?',
  opcoes: [
    { id: 'a', texto: 'Estruturar o plano de negócios e identificar a oportunidade de mercado para o novo produto', areaId: 'empreendedorismo-digital' },
    { id: 'b', texto: 'Analisar os dados de utilização para gerar relatórios de apoio à tomada de decisão executiva', areaId: 'business-intelligence' },
    { id: 'c', texto: 'Mapear e organizar os processos internos da empresa para garantir a eficiência operacional', areaId: 'processos-organizacionais' },
    { id: 'd', texto: 'Planear o cronograma, gerir orçamentos e coordenar a equipa encarregue da entrega', areaId: 'gestao-projetos-ti' },
  ],
},
  {
  id: 'ei-scenario-05',
  type: 'scenario',
  categoria: 'Área',
  enunciado: 'Um hospital precisa de modernizar os seus serviços de saúde e informática. Qual destes projetos tecnológicos te parece mais estimulante?',
  opcoes: [
    { id: 'a', texto: 'Desenvolver um modelo de IA capaz de auxiliar médicos no diagnóstico por imagem', areaId: 'ia' },
    { id: 'b', texto: 'Estruturar e gerir a base de dados centralizada onde ficam os históricos médicos dos pacientes', areaId: 'bases-dados' },
    { id: 'c', texto: 'Analisar grandes volumes de dados clínicos para identificar padrões e tendências de epidemias', areaId: 'ciencia-dados' },
    { id: 'd', texto: 'Desenvolver o portal web e a aplicação móvel para agendamento de consultas pelos pacientes', areaId: 'dev-web-mobile' },
  ],
},
  {
  id: 'ig-scenario-04',
  type: 'scenario',
  categoria: 'Área',
  enunciado: 'Estás encarregue da transformação digital e gestão de uma instituição de ensino. Onde focarias o teu esforço na vertente organizacional?',
  opcoes: [
    { id: 'a', texto: 'Implementar um sistema de informação empresarial (ERP) para integrar a gestão académica e financeira', areaId: 'sistemas-informacao' },
    { id: 'b', texto: 'Aconselhar a administração sobre como investir de forma estratégica nas tecnologias certas', areaId: 'consultoria-tecnologica' },
    { id: 'c', texto: 'Analisar métricas e dados de desempenho escolar para apoiar a tomada de decisões da direção', areaId: 'business-intelligence' },
    { id: 'd', texto: 'Redesenhar os processos de matricula e atendimento ao estudante para eliminar burocracia', areaId: 'processos-organizacionais' },
  ],
},
  // Engenharia Informática
  {
    id: 'ei-scenario-02',
    type: 'scenario',
    categoria: 'Área',
    enunciado: 'Um banco angolano quer lançar uma assistente virtual por voz e texto para atendimento ao cliente. Em que parte do desenvolvimento gostarias de atuar?',
    opcoes: [
      { id: 'a', texto: 'Treinar o modelo de linguagem para processar e compreender as intenções dos clientes', areaId: 'ia' },
      { id: 'b', texto: 'Garantir a encriptação de ponta a ponta das mensagens e a segurança dos dados bancários', areaId: 'ciberseguranca' },
      { id: 'c', texto: 'Construir o ecossistema Web e o app onde os clientes conversam com o robô', areaId: 'dev-web-mobile' },
      { id: 'd', texto: 'Estruturar o banco de dados de alto desempenho para guardar os históricos de conversas', areaId: 'bases-dados' },
    ],
  },
  {
    id: 'ei-scenario-03',
    type: 'scenario',
    categoria: 'Área',
    enunciado: 'Um laboratório de investigação pretende identificar mutações genéticas com base em milhões de exames. Qual a tua abordagem?',
    opcoes: [
      { id: 'a', texto: 'Aplicar técnicas estatísticas avançadas e Ciência de Dados para correlacionar padrões', areaId: 'ciencia-dados' },
      { id: 'b', texto: 'Projetar a arquitetura de software modular para garantir escalabilidade e manutenção do código', areaId: 'eng-software' },
      { id: 'c', texto: 'Configurar clusters de servidores e infraestrutura local para processar grandes volumes de trabalho', areaId: 'sistemas-infraestrutura' },
      { id: 'd', texto: 'Criar algoritmos específicos em linguagem de alto desempenho para resolver o problema', areaId: 'dev-software' },
    ],
  },

  // Engenharia de Telecomunicações
  {
    id: 'et-scenario-01',
    type: 'scenario',
    categoria: 'Área',
    enunciado: 'Uma refinaria no offshore angolano precisa de estar conectada em tempo real à sede em Luanda. Como resolverias a comunicação?',
    opcoes: [
      { id: 'a', texto: 'Projetar um link de comunicação redundante via Satélite e Radiofrequência (RF)', areaId: 'comunicacao-satelite' },
      { id: 'b', texto: 'Implementar firewalls e sistemas de prevenção de intrusão (IPS) na rede de comunicação', areaId: 'seguranca-redes' },
      { id: 'c', texto: 'Instalar e fazer o comissionamento dos equipamentos físicos de transmissão e antenas', areaId: 'infraestrutura-telecom' },
      { id: 'd', texto: 'Lançar e fundir cabos de fibra ótica submarina para garantir largura de banda ultra-rápida', areaId: 'fibra-otica' },
    ],
  },
  {
  id: 'et-scenario-03',
  type: 'scenario',
  categoria: 'Área',
  enunciado: 'Durante um evento num estádio com 50.000 pessoas, a rede de comunicação fica congestionada. Qual o teu plano de ação no âmbito de Telecomunicações?',
  opcoes: [
    { id: 'a', texto: 'Dimensionar e otimizar a cobertura das células móveis 4G/5G no estádio', areaId: 'redes-moveis' },
    { id: 'b', texto: 'Reconfigurar os roteadores e switches da rede local de transporte de dados', areaId: 'redes-computadores' },
    { id: 'c', texto: 'Reforçar a infraestrutura física com antenas móveis e equipamentos temporários', areaId: 'infraestrutura-telecom' },
    { id: 'd', texto: 'Ativar e otimizar links de transmissão via rádio/micro-ondas para escoar o tráfego extra', areaId: 'comunicacao-satelite' },
  ],
},

  // Informática de Gestão
  {
    id: 'ig-scenario-01',
    type: 'scenario',
    categoria: 'Área',
    enunciado: 'Uma rede de supermercados está a perder margem de lucro devido a desperdício no stock. Como podes ajudar?',
    opcoes: [
      { id: 'a', texto: 'Criar dashboards de Business Intelligence (BI) para prever a procura de produtos em tempo real', areaId: 'business-intelligence' },
      { id: 'b', texto: 'Redesenhar os processos organizacionais de compras e logística interna da empresa', areaId: 'processos-organizacionais' },
      { id: 'c', texto: 'Implementar um módulo ERP integrado de gestão de stocks e fornecedores', areaId: 'sistemas-informacao' },
      { id: 'd', texto: 'Liderar a equipa de TI incumbida de digitalizar o inventário do supermercado', areaId: 'gestao-projetos-ti' },
    ],
  },
  {
    id: 'ig-scenario-02',
    type: 'scenario',
    categoria: 'Área',
    enunciado: 'Um grupo empresarial quer modernizar totalmente os seus sistemas tradicionais. Que função gostarias de assumir?',
    opcoes: [
      { id: 'a', texto: 'Prestar consultoria estratégica para orientar a administração nos investimentos certos em TI', areaId: 'consultoria-tecnologica' },
      { id: 'b', texto: 'Idear uma nova linha de produtos digitais para abrir novos mercados e fontes de receita', areaId: 'empreendedorismo-digital' },
      { id: 'c', texto: 'Mapear e eliminar gargalos nos processos operacionais entre os diferentes departamentos', areaId: 'processos-organizacionais' },
      { id: 'd', texto: 'Planejar o cronograma, orçamentos e metodologias ágeis de entrega do projeto', areaId: 'gestao-projetos-ti' },
    ],
  },


  // RANKING
  {
    id: 'ei-ranking-01', type: 'ranking', categoria: 'Área',
    enunciado: 'Ordena estas actividades da que mais gostas para a que menos gostas.',
    itens: [
      { id: 'r1', texto: 'Construir uma aplicação do zero', areaId: 'dev-web-mobile' },
      { id: 'r2', texto: 'Treinar um modelo de IA', areaId: 'ia' },
      { id: 'r3', texto: 'Configurar servidores e infraestrutura', areaId: 'sistemas-infraestrutura' },
      { id: 'r4', texto: 'Organizar uma base de dados grande', areaId: 'bases-dados' },
    ],
  },
  {
    id: 'ei-ranking-02',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Ordena estes desafios de Engenharia Informática do que mais te atrai ao que menos te atrai:',
    itens: [
      { id: 'r1', texto: 'Construir algoritmos de Inteligência Artificial que aprendem sozinhos', areaId: 'ia' },
      { id: 'r2', texto: 'Proteger sistemas contra ataques e realizar testes de invasão (pentesting)', areaId: 'ciberseguranca' },
      { id: 'r3', texto: 'Criar aplicações Web e Mobile com interfaces modernas e rápidas', areaId: 'dev-web-mobile' },
      { id: 'r4', texto: 'Estruturar grandes bancos de dados relacionais e garantir a integridade da informação', areaId: 'bases-dados' },
    ],
  },
  {
    id: 'et-ranking-01',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Ordena estas áreas de Engenharia de Telecomunicações pela tua ordem de preferência:',
    itens: [
      { id: 'r1', texto: 'Trabalhar com redes móveis avançadas como 4G, 5G e transmissão sem fio', areaId: 'redes-moveis' },
      { id: 'r2', texto: 'Projetar e instalar redes de fibra ótica para transmissão de dados a alta velocidade', areaId: 'fibra-otica' },
      { id: 'r3', texto: 'Configurar a segurança física e lógica de redes de comunicação de dados', areaId: 'seguranca-redes' },
      { id: 'r4', texto: 'Desenvolver sistemas de comunicação via satélite e ondas de radiofrequência', areaId: 'comunicacao-satelite' },
    ],
  },
  {
    id: 'ig-ranking-01',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Ordena estas atividades da área de Informática de Gestão de acordo com o teu interesse:',
    itens: [
      { id: 'r1', texto: 'Transformar dados brutos em relatórios gráficos e dashboards interativos para executivos', areaId: 'business-intelligence' },
      { id: 'r2', texto: 'Planejar, gerir orçamentos e coordenar equipas de desenvolvimento de TI', areaId: 'gestao-projetos-ti' },
      { id: 'r3', texto: 'Criar novas startups ou negócios baseados em soluções digitais inovadoras', areaId: 'empreendedorismo-digital' },
      { id: 'r4', texto: 'Prestar consultoria a empresas para alinhar a tecnologia aos objetivos do negócio', areaId: 'consultoria-tecnologica' },
    ],
  },

  // Engenharia Informática
  {
    id: 'ei-ranking-03',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Ordena estes papéis no ciclo de vida do software conforme o teu nível de entusiasmo:',
    itens: [
      { id: 'r1', texto: 'Arquiteto de Software (Projetar a estrutura geral e padrões de desenho)', areaId: 'eng-software' },
      { id: 'r2', texto: 'Engenheiro de Dados (Construir pipelines e arquiteturas de Ciência de Dados)', areaId: 'ciencia-dados' },
      { id: 'r3', texto: 'Especialista em Segurança (Identificar vulnerabilidades e proteger o sistema)', areaId: 'ciberseguranca' },
      { id: 'r4', texto: 'Desenvolvedor Full-Stack (Criar o código do frontend e do backend)', areaId: 'dev-web-mobile' },
    ],
  },
  {
    id: 'ei-ranking-04',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Qual das seguintes tarefas tecnológicas preferes realizar no dia a dia?',
    itens: [
      { id: 'r1', texto: 'Treinar algoritmos de aprendizagem automática (Machine Learning)', areaId: 'ia' },
      { id: 'r2', texto: 'Otimizar queries complexas em bases de dados SQL para grande volume de tráfego', areaId: 'bases-dados' },
      { id: 'r3', texto: 'Administrar servidores Linux, Docker e ambientes de infraestrutura', areaId: 'sistemas-infraestrutura' },
      { id: 'r4', texto: 'Escrever aplicações eficientes e limpas usando linguagens como Python, Java ou C++', areaId: 'dev-software' },
    ],
  },

  // Engenharia de Telecomunicações
  {
    id: 'et-ranking-02',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Ordena os seguintes componentes de uma rede global de comunicações do mais estimulante para o menos estimulante:',
    itens: [
      { id: 'r1', texto: 'Roteamento IP e interconexão de redes locais e mundiais (WAN)', areaId: 'redes-computadores' },
      { id: 'r2', texto: 'Sinais de radiofrequência, micro-ondas e comunicações por satélite', areaId: 'comunicacao-satelite' },
      { id: 'r3', texto: 'Sistemas ópticos e transmissão por fibra de altíssima velocidade', areaId: 'fibra-otica' },
      { id: 'r4', texto: 'Segurança da rede, encriptação e mecanismos de defesa do tráfego', areaId: 'seguranca-redes' },
    ],
  },

  // Informática de Gestão
  {
    id: 'ig-ranking-02',
    type: 'ranking',
    categoria: 'Área',
    enunciado: 'Qual das seguintes competências organizacionais mais gostarias de desenvolver no teu futuro profissional?',
    itens: [
      { id: 'r1', texto: 'Identificar oportunidades de mercado para criar startups de base tecnológica', areaId: 'empreendedorismo-digital' },
      { id: 'r2', texto: 'Analisar indicadores financeiros e de negócio usando Business Intelligence', areaId: 'business-intelligence' },
      { id: 'r3', texto: 'Gerir equipas multidisciplinares e orçamentos em projetos de TI', areaId: 'gestao-projetos-ti' },
      { id: 'r4', texto: 'Reorganizar os fluxos de trabalho e processos internos das organizações', areaId: 'processos-organizacionais' },
    ],
  },



  // SWIPE
  {
    id: 'ei-swipe-01', type: 'swipe', categoria: 'Área', areaId: 'ciberseguranca',
    enunciado: 'Gosto de pensar como um atacante para descobrir falhas antes que aconteçam.',
  },
  // Engenharia Informática
  {
    id: 'ei-swipe-02',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'dev-software',
    enunciado: 'Adoro passar horas a resolver problemas de lógica e a transformar ideias em código funcional.',
  },
  {
    id: 'ei-swipe-03',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'eng-software',
    enunciado: 'Prefiro desenhar a arquitetura e a estrutura de um sistema complexo do que apenas codificar.',
  },
  {
    id: 'ei-swipe-04',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'ia',
    enunciado: 'Fascina-me a ideia de criar computadores que conseguem reconhecer padrões, voz e imagens.',
  },
  {
    id: 'ei-swipe-05',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'ciencia-dados',
    enunciado: 'Gosto de explorar grandes volumes de dados para descobrir tendências e fazer previsões futuras.',
  },
  {
    id: 'ei-swipe-06',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'dev-web-mobile',
    enunciado: 'Entusiasma-me ver aplicações a funcionar diretamente nos telemóveis e browsers das pessoas.',
  },

  // Engenharia de Telecomunicações
  {
    id: 'et-swipe-01',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'redes-computadores',
    enunciado: 'Tenho curiosidade sobre como os dados viajam entre computadores do outro lado do mundo.',
  },
  {
    id: 'et-swipe-02',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'redes-moveis',
    enunciado: 'Gostaria de entender a fundo como funcionam as antenas e a transmissão do sinal 5G.',
  },
  {
    id: 'et-swipe-03',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'fibra-otica',
    enunciado: 'Acho incrível como o sinal de luz dentro de cabos de vidro consegue transportar tanto tráfego de dados.',
  },
  {
    id: 'et-swipe-04',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'comunicacao-satelite',
    enunciado: 'Interesso-me por tecnologia espacial, radiofrequência e comunicações por satélite em zonas remotas.',
  },
  {
    id: 'et-swipe-05',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'seguranca-redes',
    enunciado: 'Gosto da ideia de monitorar e proteger o tráfego de comunicação de dados contra escutas indevidas.',
  },

  // Informática de Gestão
  {
    id: 'ig-swipe-01',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'sistemas-informacao',
    enunciado: 'Interesso-me em aprender como grandes softwares (como SAP ou Primavera) gerem empresas inteiras.',
  },
  {
    id: 'ig-swipe-02',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'business-intelligence',
    enunciado: 'Gosto de analisar gráficos e métricas de desempenho para apoiar a tomada de decisões de gestão.',
  },
  {
    id: 'ig-swipe-03',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'gestao-projetos-ti',
    enunciado: 'Considero-me bom a organizar tarefas, definir prazos e liderar pessoas para atingir metas.',
  },
  {
    id: 'ig-swipe-04',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'empreendedorismo-digital',
    enunciado: 'Tenho o sonho de fundar a minha própria empresa de tecnologia ou startup digital em Angola.',
  },
  {
    id: 'ig-swipe-05',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'consultoria-tecnologica',
    enunciado: 'Gosto de diagnosticar problemas operacionais em empresas e propor soluções tecnológicas eficientes.',
  },

  // Engenharia Informática
  {
    id: 'ei-swipe-17',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'dev-software',
    enunciado: 'Sinto satisfação ao transformar problemas complexos em algoritmos simples e elegantes.',
  },
  {
    id: 'ei-swipe-18',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'eng-software',
    enunciado: 'Preocupo-me muito com a qualidade do código, testes automatizados e a capacidade do sistema crescer.',
  },
  {
    id: 'ei-swipe-19',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'ia',
    enunciado: 'Entusiasma-me a possibilidade de criar agentes autónomos capazes de tomar decisões complexas.',
  },
  {
    id: 'ei-swipe-20',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'ciencia-dados',
    enunciado: 'Acho fascinante conseguir prever o futuro com base no comportamento e dados do passado.',
  },
  {
    id: 'ei-swipe-21',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'ciberseguranca',
    enunciado: 'Tenho instinto natural para encontrar falhas de segurança e brechas em sistemas informáticos.',
  },
  {
    id: 'ei-swipe-22',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'bases-dados',
    enunciado: 'Gosto de modelar esquemas de dados de forma a que a consulta da informação seja instantânea.',
  },
  {
    id: 'ei-swipe-23',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'dev-web-mobile',
    enunciado: 'Adoro desenhar e codificar aplicações intuitivas que as pessoas usam diariamente nos seus smartphones.',
  },
  {
    id: 'ei-swipe-24',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'sistemas-infraestrutura',
    enunciado: 'Fascina-me configurar computadores de alta performance e servidores na nuvem (Cloud Computing).',
  },

  // Engenharia de Telecomunicações
  {
    id: 'et-swipe-06',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'redes-computadores',
    enunciado: 'Quero perceber exatamente o caminho que um pacote de informação faz ao percorrer a internet.',
  },
  {
    id: 'et-swipe-07',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'redes-moveis',
    enunciado: 'Interesso-me pelo avanço da conectividade móvel e pela evolução das redes sem fios (Wi-Fi, 5G, 6G).',
  },
  {
    id: 'et-swipe-08',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'fibra-otica',
    enunciado: 'Gostaria de dominar o funcionamento dos sistemas ópticos que sustentam o tráfego de dados global.',
  },
  {
    id: 'et-swipe-09',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'infraestrutura-telecom',
    enunciado: 'Gosto do trabalho prático de instalar, testar e manter equipamentos de comunicação e hardware de rede.',
  },
  {
    id: 'et-swipe-10',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'seguranca-redes',
    enunciado: 'Tenho interesse em aplicar firewalls e encriptação para impedir escutas indevidas nas comunicações.',
  },
  {
    id: 'et-swipe-11',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'comunicacao-satelite',
    enunciado: 'Fascina-me a ideia de conectar zonas remotas ou navios utilizando antenas parabólicas e satélites.',
  },

  // Informática de Gestão
  {
    id: 'ig-swipe-06',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'sistemas-informacao',
    enunciado: 'Gosto de perceber como as grandes empresas usam sistemas de informação para controlar operações e recursos.',
  },
  {
    id: 'ig-swipe-07',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'business-intelligence',
    enunciado: 'Acho muito gratificante transformar números brutos em relatórios visuais que orientam diretores executivos.',
  },
  {
    id: 'ig-swipe-08',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'gestao-projetos-ti',
    enunciado: 'Gosto de gerir equipas, motivar pessoas, controlar prazos e garantir que as metas do projeto são atingidas.',
  },
  {
    id: 'ig-swipe-09',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'processos-organizacionais',
    enunciado: 'Incomoda-me ver processos manuais e ineficientes nas empresas quando poderiam ser automatizados.',
  },
  {
    id: 'ig-swipe-10',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'empreendedorismo-digital',
    enunciado: 'Tenho espírito de liderança e sonho em lançar um produto digital que resolva um problema real na sociedade.',
  },
  {
    id: 'ig-swipe-11',
    type: 'swipe',
    categoria: 'Área',
    areaId: 'consultoria-tecnologica',
    enunciado: 'Gosto de aconselhar gestores e explicar conceitos tecnológicos em linguagem simples e estratégica.',
  },


];