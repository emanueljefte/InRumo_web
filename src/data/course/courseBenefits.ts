import { AREAS } from '../../domain/test/Area';
import type { CourseId } from '../../domain/test/TestQuestion';

function getAreaNamesForCourse(courseId: CourseId): string[] {
  return Object.values(AREAS)
    .filter((area) => area.cursoId === courseId)
    .map((area) => area.nome);
}

export const COURSE_BENEFITS: Record<CourseId, { outcomes: string[]; testimonial: string; firstYearGlimpse: string }> = {
  'eng-informatica': {
    outcomes: getAreaNamesForCourse('eng-informatica'), // Desenvolvimento de Software, Engenharia de Software, IA, Ciência de Dados, Cibersegurança, Bases de Dados, Dev Web/Mobile, Sistemas e Infraestrutura
    testimonial: '"O curso deu-me a base para construir os meus próprios projetos desde o 2º ano." — [Nome, finalista]',
    firstYearGlimpse: 'No 1.º ano tens Cálculo I e II, Construção de Algoritmos e Programação, Física I e II, Álgebra e Geometria Analítica, Matemática Discreta e Linguagens de Programação.',
  },
  'eng-telecom': {
    outcomes: getAreaNamesForCourse('eng-telecom'), // Redes de Computadores, Redes Móveis, Fibra Ótica, Infraestrutura, Segurança de Redes, Comunicação por Satélite
    testimonial: '"Gosto de perceber que trabalho em algo que mantém milhões de pessoas ligadas todos os dias." — [Nome, finalista]',
    firstYearGlimpse: 'No 1.º ano tens Cálculo I e II, Física I e II, Circuitos Eléctricos I e II, Electrónica Analógica I e II e Computação I.',
  },
  'informatica-gestao': {
    outcomes: getAreaNamesForCourse('informatica-gestao'), // Sistemas de Informação, BI, Gestão de Projetos TI, Processos, Empreendedorismo, Consultoria
    testimonial: '"Consigo falar tanto com a equipa técnica como com a gestão — é o melhor dos dois mundos." — [Nome, finalista]',
    firstYearGlimpse: 'No 1.º ano tens Análise Matemática I e II, Fundamentos de Programação, Introdução às Tecnologias Informáticas, Arquitectura de Computadores e Contabilidade Geral.',
  },
};