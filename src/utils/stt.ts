/**
 * Device-Native Speech-to-Text (STT) & Text-to-Speech (TTS) Utility
 * 
 * Uses free device-native speech recognition engine:
 * - On Web/Mobile Browsers: Native Web Speech API (webkitSpeechRecognition) with zero cloud fees
 * - On Expo / React Native: @react-native-voice/voice bridge adapter
 */

// Global type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface STTState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
}

let activeRecognitionInstance: any = null;

/**
 * Check if the current environment supports free native speech recognition
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Start speech recognition listening with Korean (ko-KR) language model
 */
export function startNativeSpeechRecognition({
  onInterim,
  onFinal,
  onError,
  onEnd,
  lang = 'ko-KR',
}: {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
  lang?: string;
}): { stop: () => void } {
  // If already running, abort previous
  if (activeRecognitionInstance) {
    try {
      activeRecognitionInstance.abort();
    } catch {
      // ignore
    }
    activeRecognitionInstance = null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) {
      onError('이 기기/브라우저는 음성 인식을 지원하지 않습니다. 키보드로 입력해 보세요.');
    }
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalCollected = '';

    recognition.onstart = () => {
      // Speech started
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalCollected += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim && onInterim) {
        onInterim(interim);
      }

      if (finalCollected) {
        onFinal(finalCollected.trim());
      }
    };

    recognition.onerror = (event: any) => {
      let msg = '음성 인식 중 오류가 발생했습니다.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        msg = '마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.';
      } else if (event.error === 'no-speech') {
        msg = '음성이 감지되지 않았습니다. 마이크에 조금 더 가까이 말씀해 주세요.';
      } else if (event.error === 'audio-capture') {
        msg = '마이크 오디오 장치를 찾을 수 없습니다.';
      } else if (event.error === 'network') {
        msg = '음성 인식 네트워크 연결을 확인해주세요.';
      }
      if (onError) onError(msg);
    };

    recognition.onend = () => {
      activeRecognitionInstance = null;
      if (onEnd) onEnd();
    };

    activeRecognitionInstance = recognition;
    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
        activeRecognitionInstance = null;
      },
    };
  } catch (err: any) {
    if (onError) {
      onError(err?.message || '음성 인식을 시작할 수 없습니다.');
    }
    return { stop: () => {} };
  }
}

/**
 * Text-to-Speech (TTS) for Korean pronunciation listening
 */
export function speakKoreanText(
  text: string,
  onEnd?: () => void,
  rate = 0.9
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = rate; // slightly slow for learner clarity
    utterance.pitch = 1.0;

    // Pick Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}

/**
 * Compute similarity score between user's spoken Korean and the expected sentence (0 - 100%)
 */
export function evaluatePronunciationAccuracy(
  spoken: string,
  expected: string,
  acceptableKeywords: string[] = []
): {
  score: number;
  level: 'perfect' | 'good' | 'retry';
  feedbackKo: string;
} {
  const cleanSpoken = spoken.replace(/[^a-zA-Z0-9가-힣]/g, '').trim().toLowerCase();
  const cleanExpected = expected.replace(/[^a-zA-Z0-9가-힣]/g, '').trim().toLowerCase();

  if (!cleanSpoken) {
    return {
      score: 0,
      level: 'retry',
      feedbackKo: '음성이 인식되지 않았습니다. 다시 한번 마이크를 누르고 말씀해 보세요.',
    };
  }

  // Exact match
  if (cleanSpoken === cleanExpected) {
    return {
      score: 100,
      level: 'perfect',
      feedbackKo: '완벽한 발음입니다! 원어민 수준이에요 🎉',
    };
  }

  // Check acceptable keywords match
  let matchedKeywords = 0;
  for (const kw of acceptableKeywords) {
    const cleanKw = kw.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
    if (cleanSpoken.includes(cleanKw)) {
      matchedKeywords++;
    }
  }

  const keywordRatio = acceptableKeywords.length > 0 ? matchedKeywords / acceptableKeywords.length : 0;

  // Simple Levenshtein distance
  const distance = getLevenshteinDistance(cleanSpoken, cleanExpected);
  const maxLen = Math.max(cleanSpoken.length, cleanExpected.length);
  const similarity = Math.max(0, 1 - distance / maxLen);

  const finalScore = Math.round(
    Math.max(similarity * 100, keywordRatio * 90)
  );

  if (finalScore >= 80) {
    return {
      score: Math.min(100, finalScore),
      level: 'perfect',
      feedbackKo: '정확하고 훌륭한 표현입니다! 뜻이 명확하게 전달되었어요 👏',
    };
  } else if (finalScore >= 55) {
    return {
      score: finalScore,
      level: 'good',
      feedbackKo: '좋아요! 상대방이 충분히 이해할 수 있는 발음입니다 👍',
    };
  } else {
    return {
      score: finalScore,
      level: 'retry',
      feedbackKo: '조금 더 또박또박 천천히 발음해 보세요. 발음 가이드를 참고하세요.',
    };
  }
}

function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Native Expo / React Native Code Reference for Voice Recognition
 */
export const EXPO_VOICE_INTEGRATION_GUIDE = {
  packageName: '@react-native-voice/voice',
  setupDocs: `
// React Native Expo Native Voice Setup:
// 1. Install package:
//    npx expo install @react-native-voice/voice
// 2. Add app.json plugins:
//    "plugins": [
//      [
//        "@react-native-voice/voice",
//        {
//          "microphonePermission": "음성 역할극 및 한국어 발음 평가를 위해 마이크 접근 권한이 필요합니다.",
//          "speechRecognitionPermission": "기기 내장 음성인식을 통해 한국어 음성을 텍스트로 변환합니다."
//        }
//      ]
//    ]
// 3. Native Hook Usage:
//    Voice.onSpeechResults = (e) => setTranscript(e.value[0]);
//    await Voice.start('ko-KR');
  `.trim(),
};
