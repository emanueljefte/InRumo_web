import type { CourseId } from '../../domain/test/TestQuestion';

export const COURSE_BENEFITS: Record<CourseId, { outcomes: string[]; testimonial: string; firstYearGlimpse: string }> = {
  'eng-informatica': {
    outcomes: ['Programador(a) de software', 'Engenheiro(a) de sistemas', 'Especialista em IA/dados'],
    testimonial: '"O curso deu-me a base para construir os meus próprios projetos desde o 2º ano." — [Nome, finalista]',
    firstYearGlimpse: 'No 1º ano tens contacto direto com lógica de programação, estruturas de dados e os teus primeiros projetos práticos.',
  },
  'eng-telecom': {
    outcomes: ['Engenheiro(a) de redes', 'Técnico(a) de infraestrutura de telecom', 'Especialista em segurança de redes'],
    testimonial: '"Gosto de perceber que trabalho em algo que mantém milhões de pessoas ligadas todos os dias." — [Nome, finalista]',
    firstYearGlimpse: 'No 1º ano exploras fundamentos de eletrónica, sinais e as bases das redes de comunicação.',
  },
  'informatica-gestao': {
    outcomes: ['Analista de sistemas de informação', 'Consultor(a) de tecnologia para negócio', 'Gestor(a) de projetos digitais'],
    testimonial: '"Consigo falar tanto com a equipa técnica como com a gestão — é o melhor dos dois mundos." — [Nome, finalista]',
    firstYearGlimpse: 'No 1º ano combinas fundamentos de gestão com introdução a sistemas de informação e análise de dados.',
  },
};