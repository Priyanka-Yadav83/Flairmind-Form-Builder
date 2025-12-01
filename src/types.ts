export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'file' | 'date';

export interface Conditional {
  questionId: string;
  answer: string | number | boolean;
}

export interface Question {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  accept?: string; // e.g. '.pdf'
  maxSize?: number; // MB
  riskWeight?: number;
  conditional?: Conditional | null;
  helpText?: string;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface FormConfig {
  sections: Section[];
}
