export type QuestionType = 'mcq' | 'multi_mcq' | 'fitb';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizConfig {
  sourceType: 'manual' | 'upload';
  documentContent?: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  numQuestions: number;
  formats: QuestionType[];
  timedMode: boolean;
  secondsPerQuestion: number;
  explanationMode: boolean;
}

export interface QuizResult {
  username: string;
  subject: string;
  topic: string;
  score: number;
  total_questions: number;
  difficulty: string;
  time_taken: number;
  date: string;
}
