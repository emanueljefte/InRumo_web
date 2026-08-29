export type ChoiceOption = {
  label: string;
  weights: Record<string, number>;
};

export type SingleChoiceWeightMap = Record<string, ChoiceOption>;
export type MultiChoiceWeightMap = Record<string, ChoiceOption>;
export type ScaleWeightMap = { targets: Record<string, number> };

export type QuestionWeightMap = SingleChoiceWeightMap | MultiChoiceWeightMap | ScaleWeightMap;