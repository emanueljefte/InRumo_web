export type QuestionAnswer =
  | { type: 'likert'; score: 1 | 2 | 3 | 4 | 5 }
  | { type: 'scenario'; optionId: string }
  | { type: 'ranking'; orderedItemIds: string[] } // do mais preferido ao menos
  | { type: 'swipe'; direction: 'right' | 'left' };