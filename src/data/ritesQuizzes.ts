/**
 * Offline Korean Rites of Passage (관혼상제) 4-Choice Quiz System
 * 
 * Pre-built, hardcoded JSON array stored locally inside the app.
 * Zero external API dependency, 100% offline-ready.
 */

import ritesQuizData from './ritesQuizzes.json';
import { Language } from '../types';

export interface RitesQuizOption {
  id: string;
  textKo: string;
  textEn: string;
}

export interface RitesQuizItem {
  id: string;
  category: 'funeral' | 'wedding' | 'birthday' | 'ancestral' | 'common';
  categoryNameKo: string;
  categoryNameEn: string;
  questionKo: string;
  questionEn: string;
  questionTranslations?: Partial<Record<Language, string>>;
  options: RitesQuizOption[];
  correctAnswerId: string;
  explanationKo: string;
  explanationEn: string;
  dancheongTipKo: string;
  dancheongTipEn: string;
}

export const RITES_QUIZZES: RitesQuizItem[] = ritesQuizData as RitesQuizItem[];

export function getRitesQuizzes(): RitesQuizItem[] {
  return RITES_QUIZZES;
}

export function getRitesQuizById(id: string): RitesQuizItem | undefined {
  return RITES_QUIZZES.find((q) => q.id === id);
}

export function getRitesQuizzesByCategory(category: string): RitesQuizItem[] {
  if (category === 'all') return RITES_QUIZZES;
  return RITES_QUIZZES.filter((q) => q.category === category);
}
