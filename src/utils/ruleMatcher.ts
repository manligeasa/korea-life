/**
 * Zero-AI Local Rule-Based Feedback Matching Engine
 * 
 * Evaluates spoken or input Korean text against a pre-built local correction dictionary (JSON),
 * flagging taboo words (e.g., "축하" in funerals) with cultural correction feedback,
 * or rewarding accurate expressions with encouraging compliments.
 */

import correctionData from '../data/correctionDictionary.json';
import { Language } from '../types';

export interface RuleEvaluationResult {
  status: 'taboo_warning' | 'success_compliment' | 'guidance_retry';
  score: number;
  speechBubbleType: 'warning' | 'compliment' | 'guidance';
  feedbackTitle: string;
  feedbackText: string;
  detectedWord?: string;
  shouldAdvance: boolean;
  expectedPhrase: string;
  targetPhonetic?: string;
}

export function evaluateResponseRuleBased({
  scenarioId,
  stepIndex,
  spokenText,
  language = 'ko',
}: {
  scenarioId: string;
  stepIndex: number;
  spokenText: string;
  language?: Language;
}): RuleEvaluationResult {
  const scenarioData = (correctionData.scenarios as any)[scenarioId];
  const cleanedSpoken = spokenText.replace(/[^a-zA-Z0-9가-힣]/g, '').trim().toLowerCase();

  // If scenario not in dictionary, provide graceful fallback
  if (!scenarioData) {
    return {
      status: 'success_compliment',
      score: 85,
      speechBubbleType: 'compliment',
      feedbackTitle: '칭찬 피드백',
      feedbackText: '자연스럽고 훌륭한 한국어 표현입니다! 👏',
      shouldAdvance: true,
      expectedPhrase: '',
    };
  }

  const expectedSteps = scenarioData.expectedAnswers || [];
  const currentStepData = expectedSteps[stepIndex] || expectedSteps[0];
  const expectedPhrase = currentStepData?.targetPhrase || '';
  const targetPhonetic = currentStepData?.romanization || '';

  // 1. Check for Taboo / Forbidden / Inappropriate words FIRST
  const tabooRules = scenarioData.tabooKeywords || [];
  for (const rule of tabooRules) {
    for (const tabooWord of rule.words) {
      const cleanTaboo = tabooWord.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
      if (cleanedSpoken.includes(cleanTaboo)) {
        // Taboo detected!
        let feedback = rule.feedbackKo;
        if (language === 'en' && rule.feedbackEn) feedback = rule.feedbackEn;
        if (language === 'vi' && rule.feedbackVi) feedback = rule.feedbackVi;
        if (language === 'zh' && rule.feedbackZh) feedback = rule.feedbackZh;

        return {
          status: 'taboo_warning',
          score: 25,
          speechBubbleType: 'warning',
          feedbackTitle: `⚠️ 결례 단어 감지: "${tabooWord}"`,
          feedbackText: feedback,
          detectedWord: tabooWord,
          shouldAdvance: false,
          expectedPhrase,
          targetPhonetic,
        };
      }
    }
  }

  // 2. Check for Positive Keyword Matches & Similarity
  const positiveKeywords = currentStepData?.positiveKeywords || [];
  let matchedKeywordCount = 0;
  for (const kw of positiveKeywords) {
    const cleanKw = kw.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
    if (cleanedSpoken.includes(cleanKw)) {
      matchedKeywordCount++;
    }
  }

  const cleanExpected = expectedPhrase.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
  const isExact = cleanedSpoken === cleanExpected;
  const keywordMatchRatio = positiveKeywords.length > 0 ? matchedKeywordCount / positiveKeywords.length : 0;

  // Simple string similarity
  const distance = computeLevenshtein(cleanedSpoken, cleanExpected);
  const maxLen = Math.max(cleanedSpoken.length, cleanExpected.length);
  const textSimilarity = maxLen > 0 ? Math.max(0, 1 - distance / maxLen) : 0;

  const combinedScore = Math.round(
    Math.max(
      isExact ? 100 : 0,
      keywordMatchRatio * 95,
      textSimilarity * 100
    )
  );

  // If score is good or at least 1-2 major keywords matched
  if (combinedScore >= 60 || matchedKeywordCount >= 1) {
    const finalScore = Math.min(100, Math.max(combinedScore, 85));
    let compliment = currentStepData?.compliment || '훌륭하고 자연스러운 표현입니다!';
    if (language !== 'ko' && currentStepData?.complimentTranslations?.[language]) {
      compliment = currentStepData.complimentTranslations[language];
    }

    return {
      status: 'success_compliment',
      score: finalScore,
      speechBubbleType: 'compliment',
      feedbackTitle: '🎉 칭찬 피드백 (칭찬 말풍선)',
      feedbackText: compliment,
      shouldAdvance: true,
      expectedPhrase,
      targetPhonetic,
    };
  }

  // 3. Neither taboo nor matched: gentle guidance
  return {
    status: 'guidance_retry',
    score: 40,
    speechBubbleType: 'guidance',
    feedbackTitle: '💡 발음 가이드 및 재시도',
    feedbackText: `의도가 다소 불분명하거나 다른 단어로 인식되었습니다. 아래 가이드 문장("${expectedPhrase}")을 확인하고 다시 한번 마이크를 눌러 말씀해 보세요.`,
    shouldAdvance: false,
    expectedPhrase,
    targetPhonetic,
  };
}

function computeLevenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[a.length][b.length];
}

/**
 * Helper to get the entire dictionary for offline UI reference
 */
export function getCorrectionDictionary() {
  return correctionData;
}
