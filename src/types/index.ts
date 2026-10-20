export type Language =
  | 'ko' // 한국어
  | 'vi' // 베트남어 (Tiếng Việt)
  | 'fil' // 필리핀어 (Filipino / Tagalog)
  | 'km' // 캄보디아어 (ភាសាខ្មែរ / Khmer)
  | 'ja' // 일본어 (日本語)
  | 'uz' // 우즈베크어 (Oʻzbekcha)
  | 'ne' // 네팔어 (नेपाली)
  | 'zh' // 중국어 (中文)
  | 'en'; // 영어 (English)

export interface SupportedLanguageMeta {
  code: Language;
  name: string; // Native name
  nameKo: string; // Korean name
  greeting: string; // Native greeting
  flag: string;
  region: string;
}

export type CategoryId =
  | 'daily_korean'
  | 'conversation'
  | 'rites'
  | 'visa'
  | 'housing'
  | 'waste'
  | 'medical'
  | 'finance'
  | 'transport'
  | 'labor'
  | 'seasons'
  | 'culture';

export interface Category {
  id: CategoryId;
  nameKo: string;
  nameEn: string;
  nameVi: string;
  nameZh: string;
  nameJa?: string;
  nameFil?: string;
  nameKm?: string;
  nameUz?: string;
  nameNe?: string;
  descriptionKo: string;
  descriptionEn: string;
  descriptionVi?: string;
  descriptionZh?: string;
  descriptionJa?: string;
  descriptionFil?: string;
  descriptionKm?: string;
  descriptionUz?: string;
  descriptionNe?: string;
  icon: string;
  color: string;
}

export interface GuideItem {
  id: string;
  categoryId: CategoryId;
  titleKo: string;
  titleEn: string;
  titleVi: string;
  titleZh: string;
  titleJa?: string;
  titleFil?: string;
  titleKm?: string;
  titleUz?: string;
  titleNe?: string;
  summaryKo: string;
  summaryEn: string;
  summaryVi: string;
  summaryZh: string;
  summaryJa?: string;
  summaryFil?: string;
  summaryKm?: string;
  summaryUz?: string;
  summaryNe?: string;
  contentKo: string[];
  contentEn: string[];
  contentVi?: string[];
  contentZh?: string[];
  contentJa?: string[];
  contentFil?: string[];
  contentKm?: string[];
  contentUz?: string[];
  contentNe?: string[];
  keyTipsKo: string[];
  keyTipsEn: string[];
  keyTipsVi?: string[];
  keyTipsZh?: string[];
  keyTipsJa?: string[];
  keyTipsFil?: string[];
  keyTipsKm?: string[];
  keyTipsUz?: string[];
  keyTipsNe?: string[];
  requiredDocsKo?: string[];
  requiredDocsEn?: string[];
  hotlines?: { label: string; number: string }[];
  officialWebsites?: { title: string; url: string }[];
  isEssential?: boolean;
}

export interface EmergencyContact {
  id: string;
  nameKo: string;
  nameEn: string;
  nameVi?: string;
  nameZh?: string;
  nameJa?: string;
  nameFil?: string;
  nameKm?: string;
  nameUz?: string;
  nameNe?: string;
  number: string;
  serviceHoursKo: string;
  serviceHoursEn: string;
  supportLanguages: string[];
  badge: string;
  category: 'emergency' | 'immigration' | 'medical' | 'consultation';
}

export interface TrashItem {
  id: string;
  nameKo: string;
  nameEn: string;
  nameVi?: string;
  nameZh?: string;
  nameJa?: string;
  nameFil?: string;
  nameKm?: string;
  nameUz?: string;
  nameNe?: string;
  type: 'food' | 'general' | 'recycle' | 'special';
  disposalBagKo: string;
  disposalBagEn: string;
  instructionsKo: string;
  instructionsEn: string;
  instructionsVi?: string;
  instructionsZh?: string;
  instructionsJa?: string;
  instructionsFil?: string;
  instructionsKm?: string;
  instructionsUz?: string;
  instructionsNe?: string;
  isCommonMistake?: boolean;
}

export interface ChecklistItem {
  id: string;
  stage: 'week1' | 'month1' | 'month3';
  titleKo: string;
  titleEn: string;
  titleVi?: string;
  titleZh?: string;
  titleJa?: string;
  titleFil?: string;
  titleKm?: string;
  titleUz?: string;
  titleNe?: string;
  descriptionKo: string;
  descriptionEn: string;
  descriptionVi?: string;
  descriptionZh?: string;
  descriptionJa?: string;
  descriptionFil?: string;
  descriptionKm?: string;
  descriptionUz?: string;
  descriptionNe?: string;
  deadlineTextKo: string;
  deadlineTextEn: string;
  completed: boolean;
}

export interface PersonalNote {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}

export interface VisaTrackerState {
  visaType: string;
  expiryDate: string; // YYYY-MM-DD
  reminderEnabled: boolean;
}

export type TabType = 'home' | 'guides' | 'tools' | 'saved' | 'settings' | 'level';

export type KoreanLearningLevel = 'intro' | 'beginner' | 'intermediate' | 'advanced';

export interface LearningLevelInfo {
  id: KoreanLearningLevel;
  nameKo: string;
  nameEn: string;
  badge: string;
  subtitleKo: string;
  subtitleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  targetAudienceKo: string;
  targetAudienceEn: string;
  difficulty: number; // 1 to 4
  dancheongColor: {
    primary: string;
    soft: string;
    border: string;
    text: string;
  };
  samplePhraseKo: string;
  samplePhraseEn: string;
}

export interface QuizOption {
  id: string;
  textKo: string;
  meaningEn?: string;
  meaningTrans?: string;
}

export interface QuizQuestion {
  id: string;
  level: KoreanLearningLevel;
  category: 'alphabet' | 'conversation' | 'daily' | 'work_admin' | 'culture_etiquette';
  categoryTitleKo: string;
  categoryTitleEn: string;
  situationKo: string;
  situationEn: string;
  questionKo: string;
  questionEn: string;
  questionTrans?: Record<string, string>;
  dialogue?: { speaker: string; text: string }[];
  options: QuizOption[];
  correctAnswerId: string;
  explanationKo: string;
  explanationEn: string;
  explanationTrans?: Record<string, string>;
  dancheongTipKo: string;
  dancheongTipEn: string;
}

export interface RoleplayMessage {
  id: string;
  sender: 'partner' | 'user';
  textKo: string;
  translation: string;
  romanization?: string;
  timestamp: string;
  accuracyScore?: number;
}

export interface RoleplayScenario {
  id: string;
  categoryId: CategoryId;
  titleKo: string;
  titleEn: string;
  titleByLang: Partial<Record<Language, string>>;
  partnerRole: string;
  partnerRoleTrans: Partial<Record<Language, string>>;
  userRole: string;
  userRoleTrans: Partial<Record<Language, string>>;
  situationKo: string;
  situationEn: string;
  situationByLang: Partial<Record<Language, string>>;
  culturalTipKo: string;
  culturalTipEn: string;
  culturalTipByLang?: Partial<Record<Language, string>>;
  dancheongColor: {
    accent: string;
    soft: string;
    border: string;
  };
  initialMessages: RoleplayMessage[];
  expectedResponses: {
    promptKo: string;
    expectedKo: string;
    phonetic: string;
    meaning: Partial<Record<Language, string>>;
    acceptableKeywords: string[];
    partnerReply: string;
    partnerReplyTranslation: Partial<Record<Language, string>>;
  }[];
}
