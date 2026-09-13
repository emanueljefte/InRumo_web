import { LikertQuestionCard } from './LikertQuestionCard';
import { ScenarioQuestionCard } from './ScenarioQuestionCard';
import { RankingQuestionCard } from './RankingQuestionCard';
import { SwipeQuestionCard } from './SwipeQuestionCard';
import type { MatriculadoQuestion } from '../../../domain/test/MatriculadoQuestion';
import type { QuestionAnswer } from '../../../domain/test/QuestionAnswer';

export function QuestionRenderer({ question, onAnswer }: { question: MatriculadoQuestion; onAnswer: (a: QuestionAnswer) => void }) {
  switch (question.type) {
    case 'likert': return <LikertQuestionCard onAnswer={onAnswer} />;
    case 'scenario': return <ScenarioQuestionCard question={question} onAnswer={onAnswer} />;
    case 'ranking': return <RankingQuestionCard question={question} onAnswer={onAnswer} />;
    case 'swipe': return <SwipeQuestionCard onAnswer={onAnswer} />;
  }
}