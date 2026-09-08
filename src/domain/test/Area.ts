import type { CourseId } from "./TestQuestion";

export type AreaId =
  | 'dev-software' | 'eng-software' | 'ia' | 'ciencia-dados' | 'ciberseguranca' | 'bases-dados' | 'dev-web-mobile' | 'sistemas-infraestrutura'
  | 'redes-computadores' | 'redes-moveis' | 'fibra-otica' | 'infraestrutura-telecom' | 'seguranca-redes' | 'comunicacao-satelite'
  | 'sistemas-informacao' | 'business-intelligence' | 'gestao-projetos-ti' | 'processos-organizacionais' | 'empreendedorismo-digital' | 'consultoria-tecnologica';

export const AREAS: Record<AreaId, { nome: string; cursoId: CourseId }> = {
  'dev-software': { nome: 'Desenvolvimento de Software', cursoId: 'eng-informatica' },
  'eng-software': { nome: 'Engenharia de Software', cursoId: 'eng-informatica' },
  'ia': { nome: 'Inteligência Artificial', cursoId: 'eng-informatica' },
  'ciencia-dados': { nome: 'Ciência de Dados', cursoId: 'eng-informatica' },
  'ciberseguranca': { nome: 'Cibersegurança', cursoId: 'eng-informatica' },
  'bases-dados': { nome: 'Bases de Dados', cursoId: 'eng-informatica' },
  'dev-web-mobile': { nome: 'Desenvolvimento Web/Mobile', cursoId: 'eng-informatica' },
  'sistemas-infraestrutura': { nome: 'Sistemas e Infraestrutura', cursoId: 'eng-informatica' },
  'redes-computadores': { nome: 'Redes de Computadores', cursoId: 'eng-telecom' },
  'redes-moveis': { nome: 'Redes Móveis e Comunicações Sem Fio', cursoId: 'eng-telecom' },
  'fibra-otica': { nome: 'Fibra Ótica e Sistemas de Transmissão', cursoId: 'eng-telecom' },
  'infraestrutura-telecom': { nome: 'Infraestrutura e Equipamentos de Telecom', cursoId: 'eng-telecom' },
  'seguranca-redes': { nome: 'Segurança de Redes', cursoId: 'eng-telecom' },
  'comunicacao-satelite': { nome: 'Sistemas de Comunicação por Satélite/RF', cursoId: 'eng-telecom' },
  'sistemas-informacao': { nome: 'Sistemas de Informação Empresarial', cursoId: 'informatica-gestao' },
  'business-intelligence': { nome: 'Análise de Dados para Negócio', cursoId: 'informatica-gestao' },
  'gestao-projetos-ti': { nome: 'Gestão de Projetos de TI', cursoId: 'informatica-gestao' },
  'processos-organizacionais': { nome: 'Processos e Eficiência Organizacional', cursoId: 'informatica-gestao' },
  'empreendedorismo-digital': { nome: 'Empreendedorismo e Inovação Digital', cursoId: 'informatica-gestao' },
  'consultoria-tecnologica': { nome: 'Consultoria Tecnológica para Gestão', cursoId: 'informatica-gestao' },
};