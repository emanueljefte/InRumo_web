import type { CourseId } from "./TestQuestion";

export type AreaId =
  | 'dev-software' | 'eng-software' | 'ia' | 'ciencia-dados' | 'ciberseguranca' | 'bases-dados' | 'dev-web-mobile' | 'sistemas-infraestrutura'
  | 'redes-computadores' | 'redes-moveis' | 'fibra-otica' | 'infraestrutura-telecom' | 'seguranca-redes' | 'comunicacao-satelite'
  | 'sistemas-informacao' | 'business-intelligence' | 'gestao-projetos-ti' | 'processos-organizacionais' | 'empreendedorismo-digital' | 'consultoria-tecnologica';


export const AREAS: Record<AreaId, { nome: string; cursoId: CourseId; descricao: string }> = {
  'dev-software': { nome: 'Desenvolvimento de Software', cursoId: 'eng-informatica', descricao: 'Construção de programas e aplicações, da lógica ao código.' },
  'eng-software': { nome: 'Engenharia de Software', cursoId: 'eng-informatica', descricao: 'Desenho, arquitectura e boas práticas na construção de sistemas de grande escala.' },
  'ia': { nome: 'Inteligência Artificial', cursoId: 'eng-informatica', descricao: 'Sistemas que aprendem e tomam decisões a partir de dados.' },
  'ciencia-dados': { nome: 'Ciência de Dados', cursoId: 'eng-informatica', descricao: 'Análise de grandes volumes de dados para extrair conhecimento e prever tendências.' },
  'ciberseguranca': { nome: 'Cibersegurança', cursoId: 'eng-informatica', descricao: 'Protecção de sistemas e dados contra acessos e ataques não autorizados.' },
  'bases-dados': { nome: 'Bases de Dados', cursoId: 'eng-informatica', descricao: 'Organização, armazenamento e gestão eficiente de informação estruturada.' },
  'dev-web-mobile': { nome: 'Desenvolvimento Web/Mobile', cursoId: 'eng-informatica', descricao: 'Criação de aplicações para browsers e dispositivos móveis.' },
  'sistemas-infraestrutura': { nome: 'Sistemas e Infraestrutura', cursoId: 'eng-informatica', descricao: 'Manutenção de servidores, redes internas e ambientes operacionais.' },
  'redes-computadores': { nome: 'Redes de Computadores', cursoId: 'eng-telecom', descricao: 'Ligação e comunicação entre dispositivos, dentro e fora de uma organização.' },
  'redes-moveis': { nome: 'Redes Móveis e Comunicações Sem Fio', cursoId: 'eng-telecom', descricao: 'Tecnologias de conectividade móvel, como 4G, 5G e além.' },
  'fibra-otica': { nome: 'Fibra Ótica e Sistemas de Transmissão', cursoId: 'eng-telecom', descricao: 'Transmissão de dados a alta velocidade através de sinais luminosos.' },
  'infraestrutura-telecom': { nome: 'Infraestrutura e Equipamentos de Telecom', cursoId: 'eng-telecom', descricao: 'Instalação e manutenção de equipamentos físicos de comunicação.' },
  'seguranca-redes': { nome: 'Segurança de Redes', cursoId: 'eng-telecom', descricao: 'Protecção de infraestruturas de comunicação contra acessos indevidos.' },
  'comunicacao-satelite': { nome: 'Sistemas de Comunicação por Satélite/RF', cursoId: 'eng-telecom', descricao: 'Transmissão de dados através de satélites e radiofrequência.' },
  'sistemas-informacao': { nome: 'Sistemas de Informação Empresarial', cursoId: 'informatica-gestao', descricao: 'Tecnologia aplicada à gestão e organização de processos de negócio.' },
  'business-intelligence': { nome: 'Análise de Dados para Negócio', cursoId: 'informatica-gestao', descricao: 'Transformação de dados empresariais em informação para apoiar decisões.' },
  'gestao-projetos-ti': { nome: 'Gestão de Projetos de TI', cursoId: 'informatica-gestao', descricao: 'Planeamento e coordenação de projectos tecnológicos.' },
  'processos-organizacionais': { nome: 'Processos e Eficiência Organizacional', cursoId: 'informatica-gestao', descricao: 'Análise e melhoria de processos internos de uma empresa.' },
  'empreendedorismo-digital': { nome: 'Empreendedorismo e Inovação Digital', cursoId: 'informatica-gestao', descricao: 'Criação de novos negócios e soluções digitais.' },
  'consultoria-tecnologica': { nome: 'Consultoria Tecnológica para Gestão', cursoId: 'informatica-gestao', descricao: 'Aconselhamento a empresas sobre como usar tecnologia de forma estratégica.' },
};