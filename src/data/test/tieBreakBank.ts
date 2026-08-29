import type { TestQuestion } from '../../domain/test/TestQuestion';

export const TIE_BREAK_BANK: Record<string, TestQuestion[]> = {
  'eng-informatica_eng-telecom': [
    { id: 'tb-01', category: 'Desempate', courseId: 'eng-informatica', statement: 'Prefiro escrever código a montar/configurar equipamentos físicos.' },
    { id: 'tb-02', category: 'Desempate', courseId: 'eng-telecom', statement: 'Prefiro perceber como os dados viajam fisicamente a como são processados.' },
    { id: 'tb-03', category: 'Desempate', courseId: 'eng-informatica', statement: 'Sinto-me mais atraído por software do que por hardware/infraestrutura.' },
  ],
  'eng-informatica_informatica-gestao': [ /* análogo, 3 perguntas */ ],
  'eng-telecom_informatica-gestao': [ /* análogo, 3 perguntas */ ],
};