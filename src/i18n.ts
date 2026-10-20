import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language, SupportedLanguageMeta } from './types';

import ko from './locales/ko.json';
import vi from './locales/vi.json';
import fil from './locales/fil.json';
import km from './locales/km.json';
import ja from './locales/ja.json';
import uz from './locales/uz.json';
import ne from './locales/ne.json';
import zh from './locales/zh.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES: SupportedLanguageMeta[] = [
  { code: 'ko', name: '한국어', nameKo: '한국어', greeting: '안녕하세요', flag: '🇰🇷', region: '대한민국' },
  { code: 'vi', name: 'Tiếng Việt', nameKo: '베트남어', greeting: 'Xin chào', flag: '🇻🇳', region: 'Việt Nam' },
  { code: 'fil', name: 'Filipino / Tagalog', nameKo: '필리핀어', greeting: 'Kamusta', flag: '🇵🇭', region: 'Pilipinas' },
  { code: 'km', name: 'ភាសាខ្មែរ (Khmer)', nameKo: '캄보디아어', greeting: 'ជំរាបសួរ', flag: '🇰🇭', region: 'កម្ពុជា' },
  { code: 'ja', name: '日本語', nameKo: '일본어', greeting: 'こんにちは', flag: '🇯🇵', region: '日本' },
  { code: 'uz', name: 'Oʻzbekcha', nameKo: '우즈베크어', greeting: 'Salom', flag: '🇺🇿', region: 'Oʻzbekiston' },
  { code: 'ne', name: 'नेपाली (Nepali)', nameKo: '네팔어', greeting: 'नमस्ते', flag: '🇳🇵', region: 'नेपाल' },
  { code: 'zh', name: '中文 (简体)', nameKo: '중국어', greeting: '你好', flag: '🇨🇳', region: '中国' },
  { code: 'en', name: 'English', nameKo: '영어', greeting: 'Hello', flag: '🇺🇸', region: 'Global' },
];

export const resources = {
  ko: { translation: ko },
  vi: { translation: vi },
  fil: { translation: fil },
  km: { translation: km },
  ja: { translation: ja },
  uz: { translation: uz },
  ne: { translation: ne },
  zh: { translation: zh },
  en: { translation: en },
} as const;

// Read previously saved language or default to 'ko'
const savedLanguage = (typeof window !== 'undefined'
  ? window.localStorage.getItem('korea_life_language')
  : null) || 'ko';

// Normalize saved language to supported codes
const initialLang = ['ko', 'vi', 'fil', 'km', 'ja', 'uz', 'ne', 'zh', 'en'].includes(savedLanguage.replace(/"/g, ''))
  ? savedLanguage.replace(/"/g, '')
  : 'ko';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
