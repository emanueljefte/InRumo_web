import type { AreaId } from './Area';

export type QuestionType = 'likert' | 'scenario' | 'ranking' | 'swipe';

type BaseQuestion = { id: string; categoria: string; enunciado: string };

export type LikertQuestion = BaseQuestion & { type: 'likert'; areaId?: AreaId };

export type ScenarioOption = { id: string; texto: string; areaId: AreaId };
export type ScenarioQuestion = BaseQuestion & { type: 'scenario'; opcoes: ScenarioOption[] };

export type RankingItem = { id: string; texto: string; areaId: AreaId };
export type RankingQuestion = BaseQuestion & { type: 'ranking'; itens: RankingItem[] };

export type SwipeQuestion = BaseQuestion & { type: 'swipe'; areaId: AreaId };

export type MatriculadoQuestion = LikertQuestion | ScenarioQuestion | RankingQuestion | SwipeQuestion;