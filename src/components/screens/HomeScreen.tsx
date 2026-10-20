import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PhoneCall,
  Search,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Calendar,
  ArrowRight,
  GraduationCap,
  Award,
  LayoutGrid,
  List,
  Mic,
  Clock5,
  MessagesSquare,
  Scroll,
  ShieldCheck,
  Home,
  Trash2,
  HeartPulse,
  CreditCard,
  Compass,
  Briefcase,
  CalendarDays,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import {
  CATEGORIES,
  EMERGENCY_CONTACTS,
  DAILY_TIPS,
  GUIDES,
} from '../../data/initialData';
import { Category, CategoryId, Language, VisaTrackerState, KoreanLearningLevel } from '../../types';
import { getLevelMeta, getQuestionsByLevel } from '../../data/learningQuizzes';
import {
  getCategoryTitle,
  getCategoryDesc,
  getGuideTitle,
  getGuideSummary,
  getEmergencyName,
} from '../../utils/localization';

interface HomeScreenProps {
  language: Language;
  learningLevel?: KoreanLearningLevel;
  onNavigateToCategory: (categoryId: CategoryId) => void;
  onSelectGuide: (guideId: string) => void;
  onNavigateToTab: (tab: 'guides' | 'tools' | 'saved' | 'settings' | 'level') => void;
  onOpenLevelModal?: () => void;
  onOpenRoleplay?: (scenarioId?: string) => void;
  onOpenRitesQuiz?: () => void;
  visaState: VisaTrackerState;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  learningLevel = 'beginner',
  onNavigateToCategory,
  onSelectGuide,
  onNavigateToTab,
  onOpenLevelModal,
  onOpenRoleplay,
  onOpenRitesQuiz,
  visaState,
}) => {
  const { t } = useTranslation();
  const [tipIndex, setTipIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'language' | 'admin' | 'living'>('all');

  const currentLevelMeta = getLevelMeta(learningLevel);
  const levelQuestions = getQuestionsByLevel(learningLevel);
  const currentTip = DAILY_TIPS[tipIndex % DAILY_TIPS.length];

  // Calculate Visa D-Day if set
  let visaDaysLeft: number | null = null;
  if (visaState.expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(visaState.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    visaDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Filter 11 categories
  const filteredCategories = CATEGORIES.filter((cat) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = getCategoryTitle(cat, language).toLowerCase();
      const desc = getCategoryDesc(cat, language).toLowerCase();
      const titleKo = cat.nameKo.toLowerCase();
      if (!title.includes(q) && !desc.includes(q) && !titleKo.includes(q)) {
        return false;
      }
    }

    // Category group filter
    if (categoryFilter === 'language') {
      return cat.id === 'daily_korean' || cat.id === 'conversation' || cat.id === 'rites';
    }
    if (categoryFilter === 'admin') {
      return cat.id === 'visa' || cat.id === 'housing' || cat.id === 'waste';
    }
    if (categoryFilter === 'living') {
      return (
        cat.id === 'medical' ||
        cat.id === 'finance' ||
        cat.id === 'transport' ||
        cat.id === 'labor' ||
        cat.id === 'seasons'
      );
    }
    return true;
  });

  // Helper to render Category Icon
  const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'MessagesSquare':
        return <MessagesSquare className={className} />;
      case 'Scroll':
        return <Scroll className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Home':
        return <Home className={className} />;
      case 'Trash2':
        return <Trash2 className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'CreditCard':
        return <CreditCard className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'CalendarDays':
        return <CalendarDays className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Helper for Category badge label
  const getCategoryFeatureBadge = (id: CategoryId) => {
    switch (id) {
      case 'rites':
        return { label: '음성 역할극 🎙️', isRoleplay: true, scenarioId: 'rites-funeral' };
      case 'conversation':
        return { label: '음성 역할극 🎙️', isRoleplay: true, scenarioId: 'conv-restaurant' };
      case 'daily_korean':
        return { label: '5분 데일리 ⏱️', isRoleplay: false };
      case 'housing':
        return { label: '보증금 보호 🔑', isRoleplay: false };
      case 'medical':
        return { label: '119 긴급통역 🏥', isRoleplay: false };
      case 'waste':
        return { label: '과태료 주의 ♻️', isRoleplay: false };
      case 'labor':
        return { label: '주휴수당 계산 💼', isRoleplay: false };
      case 'finance':
        return { label: '해외송금 💳', isRoleplay: false };
      case 'transport':
        return { label: '환승할인 🚌', isRoleplay: false };
      case 'visa':
        return { label: '필수 행정 🏛️', isRoleplay: false };
      case 'seasons':
        return { label: '전통 명절 🌸', isRoleplay: false };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Hero Welcome Card (Dancheong & Hanji Aesthetic) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#253342] via-[#2A5C4E] to-[#3D836E] text-white p-5 sm:p-6 shadow-md border border-[#E8E2D6]/40">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-[#E8F3F0] backdrop-blur-xs border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#DF684E]" />
              대한민국 생활 정착 가이드
            </span>
            <span className="text-[11px] text-white/70 font-medium">
              11개 마스터 코스
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              {t('heroTitle', '한국생활 보석상자')}
            </h2>
            <p className="text-xs sm:text-sm text-[#E8F3F0]/90 leading-relaxed max-w-xl">
              선택하신 언어로 안내되는 11개의 주요 학습 주제와 무료 기기 내장 음성인식(STT) 역할극으로 안전하고 자신감 있게 한국 생활을 시작하세요.
            </p>
          </div>

          {/* Quick Action Chips in Hero */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {onOpenRoleplay && (
              <button
                onClick={() => onOpenRoleplay('rites-funeral')}
                className="px-3 py-1.5 rounded-xl bg-[#DF684E] hover:bg-[#BA462E] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>관혼상제 음성 역할극</span>
              </button>
            )}

            {onOpenRitesQuiz && (
              <button
                onClick={onOpenRitesQuiz}
                className="px-3 py-1.5 rounded-xl bg-[#253342] hover:bg-[#1a2530] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer border border-white/20"
              >
                <Scroll className="w-3.5 h-3.5 text-amber-300" />
                <span>관혼상제 퀴즈 (10문항)</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onOpenLevelModal) onOpenLevelModal();
                else onNavigateToTab('level');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentLevelMeta.nameKo} 맞춤 문제 ({levelQuestions.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative Traditional Dancheong Floral Curves */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-12 -top-12 w-32 h-32 rounded-full bg-[#DF684E]/15 blur-xl pointer-events-none" />
      </section>

      {/* Korean Learning Level & Adaptive Quiz Card */}
      <section className="relative overflow-hidden p-4 rounded-2xl bg-white border border-[#E8E2D6] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#3D836E]/10 text-[#3D836E]">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#253342]">
              나의 한국어 학습 수준 & 난이도
            </span>
          </div>

          <button
            onClick={() => {
              if (onOpenLevelModal) onOpenLevelModal();
              else onNavigateToTab('level');
            }}
            className="text-[11px] font-bold text-[#3D836E] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>수준 변경</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Level Highlight Box */}
        <div
          onClick={() => {
            if (onOpenLevelModal) onOpenLevelModal();
            else onNavigateToTab('level');
          }}
          className="p-3.5 rounded-xl border transition-all cursor-pointer active:scale-[0.99] flex items-center justify-between gap-3 group"
          style={{
            backgroundColor: currentLevelMeta.dancheongColor.soft,
            borderColor: currentLevelMeta.dancheongColor.border,
          }}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-extrabold"
                style={{
                  backgroundColor: 'white',
                  color: currentLevelMeta.dancheongColor.text,
                }}
              >
                {currentLevelMeta.badge}
              </span>
              <span className="text-sm font-extrabold text-[#253342]">
                {currentLevelMeta.nameKo} ({currentLevelMeta.nameEn})
              </span>
              <div className="flex items-center gap-0.5 ml-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < currentLevelMeta.difficulty ? 'bg-[#3D836E]' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs font-medium text-stone-700 truncate">
              {currentLevelMeta.subtitleKo}
            </p>
            <p className="text-[11px] text-stone-500 italic truncate">
              "{currentLevelMeta.samplePhraseKo}"
            </p>
          </div>

          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#3D836E] shadow-2xs group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action Button for Adaptive Questions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (onOpenLevelModal) onOpenLevelModal();
              else onNavigateToTab('level');
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#3D836E] hover:bg-[#255849] text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{currentLevelMeta.nameKo} 난이도 맞춤 문제 풀기 ({levelQuestions.length}문항)</span>
          </button>
        </div>
      </section>

      {/* MAIN MENU: 11 Major Learning Topics with Card/Grid Toggle (Requirement #3) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DF684E]" />
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-[#253342]">
                11대 주요 학습 주제
              </h3>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              선택한 언어로 맞춤 제공되는 실전 한국어 & 생활 가이드
            </p>
          </div>

          {/* View Mode Toggle: Grid vs Card List */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E8E2D6] shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#3D836E] text-white shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="그리드 레이아웃"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">그리드</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-[#3D836E] text-white shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="카드형 리스트 레이아웃"
            >
              <List className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">리스트</span>
            </button>
          </div>
        </div>

        {/* Category Topic Group Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#253342] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-[#E8E2D6]'
            }`}
          >
            전체 11개 주제
          </button>
          <button
            onClick={() => setCategoryFilter('language')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'language'
                ? 'bg-[#DF684E] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-[#E8E2D6]'
            }`}
          >
            한국어 & 관혼상제 (3)
          </button>
          <button
            onClick={() => setCategoryFilter('admin')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'admin'
                ? 'bg-[#3D836E] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-[#E8E2D6]'
            }`}
          >
            행정 & 주거 (3)
          </button>
          <button
            onClick={() => setCategoryFilter('living')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'living'
                ? 'bg-[#B07B18] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-[#E8E2D6]'
            }`}
          >
            생활 & 권익 (5)
          </button>
        </div>

        {/* 11 Topics Display: GRID or CARD LIST */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCategories.map((cat, idx) => {
              const badgeInfo = getCategoryFeatureBadge(cat.id);
              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-white border border-[#E8E2D6] hover:border-[#3D836E] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#EEF6F3] border border-[#E8E2D6] text-[#3D836E] shadow-2xs group-hover:scale-105 transition-transform">
                          {renderCategoryIcon(cat.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-stone-400">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            {badgeInfo && (
                              <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  badgeInfo.isRoleplay
                                    ? 'bg-[#FDF0EC] text-[#DF684E] border border-[#F6BCB0]'
                                    : 'bg-[#EEF6F3] text-[#3D836E] border border-[#A3CEC2]'
                                }`}
                              >
                                {badgeInfo.label}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-extrabold text-[#253342] group-hover:text-[#3D836E] transition-colors leading-snug">
                            {getCategoryTitle(cat, language)}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="inline-block text-[11px] font-semibold text-stone-700 bg-stone-100/80 px-2 py-0.5 rounded">
                        {cat.nameKo}
                      </span>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {getCategoryDesc(cat, language)}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between gap-1.5 flex-wrap">
                    {badgeInfo?.isRoleplay && onOpenRoleplay ? (
                      <button
                        onClick={() => onOpenRoleplay(badgeInfo.scenarioId)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-[#DF684E] hover:bg-[#BA462E] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap"
                      >
                        <Mic className="w-3 h-3" />
                        <span>음성 역할극</span>
                      </button>
                    ) : null}

                    {cat.id === 'rites' && onOpenRitesQuiz ? (
                      <button
                        onClick={onOpenRitesQuiz}
                        className="py-1.5 px-2.5 rounded-xl bg-[#253342] hover:bg-[#1a2530] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap"
                        title="관혼상제 4지선다 예절 퀴즈 풀기"
                      >
                        <Scroll className="w-3 h-3 text-amber-300" />
                        <span>예절 퀴즈</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => onNavigateToCategory(cat.id)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        badgeInfo?.isRoleplay
                          ? 'bg-[#FAF7F2] hover:bg-stone-200 text-stone-700'
                          : 'w-full bg-[#EEF6F3] hover:bg-[#3D836E] text-[#3D836E] hover:text-white'
                      }`}
                    >
                      <span>가이드 보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* CARD LIST LAYOUT */
          <div className="space-y-2.5">
            {filteredCategories.map((cat, idx) => {
              const badgeInfo = getCategoryFeatureBadge(cat.id);
              return (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#E8E2D6] hover:border-[#3D836E] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#EEF6F3] border border-[#E8E2D6] text-[#3D836E] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      {renderCategoryIcon(cat.icon, 'w-5 h-5')}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-stone-400">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#253342] group-hover:text-[#3D836E] transition-colors truncate">
                          {getCategoryTitle(cat, language)}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-semibold bg-stone-100 px-1.5 py-0.2 rounded">
                          {cat.nameKo}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate max-w-sm sm:max-w-md">
                        {getCategoryDesc(cat, language)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {badgeInfo?.isRoleplay && onOpenRoleplay && (
                      <button
                        onClick={() => onOpenRoleplay(badgeInfo.scenarioId)}
                        className="py-1.5 px-2.5 rounded-xl bg-[#DF684E] text-white text-[11px] font-bold hover:bg-[#BA462E] transition-colors flex items-center gap-1 shadow-2xs"
                        title="음성 역할극 시작"
                      >
                        <Mic className="w-3 h-3" />
                        <span className="hidden sm:inline">역할극</span>
                      </button>
                    )}

                    {cat.id === 'rites' && onOpenRitesQuiz && (
                      <button
                        onClick={onOpenRitesQuiz}
                        className="py-1.5 px-2.5 rounded-xl bg-[#253342] text-white text-[11px] font-bold hover:bg-[#1a2530] transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="관혼상제 4지선다 예절 퀴즈 풀기"
                      >
                        <Scroll className="w-3 h-3 text-amber-300" />
                        <span className="hidden sm:inline">예절 퀴즈</span>
                      </button>
                    )}

                    <button
                      onClick={() => onNavigateToCategory(cat.id)}
                      className="p-2 rounded-xl bg-[#FAF7F2] group-hover:bg-[#EEF6F3] text-stone-500 group-hover:text-[#3D836E] transition-colors border border-[#E8E2D6]/60"
                      title="가이드 보기"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Visa D-Day Widget (Dancheong Pastel Theme) */}
      {visaDaysLeft !== null && (
        <section
          onClick={() => onNavigateToTab('tools')}
          className="cursor-pointer group flex items-center justify-between p-4 rounded-2xl bg-white/90 border border-[#E8E2D6] hover:border-[#3D836E] shadow-2xs transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF6F3] text-[#3D836E] border border-[#A3CEC2] shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#253342]">
                  {visaState.visaType || '비자'} {t('visaDdayWidgetTitle', '체류 만료일')}
                </span>
                <span className="text-[10px] font-medium text-stone-500">
                  {visaState.expiryDate}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {visaDaysLeft > 0
                  ? t('visaDaysLeft', {
                      days: visaDaysLeft,
                      defaultValue: `만료일까지 ${visaDaysLeft}일 남았습니다.`,
                    })
                  : t('visaExpired', '체류기간이 만료되었습니다!')}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`text-lg sm:text-xl font-extrabold ${
                visaDaysLeft <= 30 ? 'text-[#DF684E]' : 'text-[#3D836E]'
              }`}
            >
              {visaDaysLeft > 0 ? `D-${visaDaysLeft}` : '만료'}
            </span>
          </div>
        </section>
      )}

      {/* Today's Life Tip Card (Hanji Surface & Dancheong Hwang Ochre accent) */}
      <section className="relative overflow-hidden rounded-2xl bg-white/95 p-4 border border-[#E8E2D6] shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[#D49B28]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold tracking-tight uppercase">
              {t('todayTipTitle', '오늘의 한국생활 꿀팁')}
            </span>
          </div>
          <button
            onClick={() => setTipIndex((prev) => prev + 1)}
            className="text-[11px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
          >
            {t('nextTip', '다음 팁 보기 →')}
          </button>
        </div>

        <div className="mt-2.5 space-y-1">
          <h4 className="text-sm font-semibold text-[#253342]">
            {language === 'ko' ? currentTip.titleKo : currentTip.titleEn}
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            {language === 'ko' ? currentTip.descKo : currentTip.descEn}
          </p>
        </div>
      </section>

      {/* Emergency Hotlines Strip (Click to call with Dancheong Vermilion accent) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#253342]">
            <ShieldAlert className="w-4 h-4 text-[#DF684E]" />
            <h3 className="text-sm font-bold tracking-tight">
              {t('emergencyTitle', '긴급 연락처 바로연결')}
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            {t('tapToCall', '터치 시 통화 연결')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EMERGENCY_CONTACTS.slice(0, 6).map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.number}`}
              className="flex flex-col justify-between p-3 rounded-xl bg-white/95 border border-[#E8E2D6] hover:border-[#DF684E] shadow-2xs active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#C4472D] bg-[#FDF0EC] px-1.5 py-0.5 rounded-md border border-[#F6BCB0]">
                  {contact.badge}
                </span>
                <PhoneCall className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#DF684E] transition-colors" />
              </div>

              <div className="mt-2">
                <div className="text-base sm:text-lg font-extrabold text-[#253342] tracking-tight">
                  {contact.number}
                </div>
                <div className="text-[11px] font-medium text-stone-600 truncate">
                  {getEmergencyName(contact, language)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Must-Read Survival Guide with Dancheong Noerok Celadon */}
      <section className="rounded-2xl bg-gradient-to-r from-[#2A5C4E] to-[#3D836E] p-4 text-white shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full text-[#E8F3F0]">
            {t('essentialBadge', '필수 체크')}
          </span>
          <span className="text-[11px] text-[#E8F3F0]">Housing & Lease</span>
        </div>

        <h4 className="text-sm sm:text-base font-bold mt-2 leading-snug">
          전·월세 계약 후 보증금 떼이지 않는 법: 확정일자와 전입신고
        </h4>
        <p className="text-xs text-[#E8F3F0]/90 mt-1 line-clamp-2">
          이사 당일 동 주민센터에서 확정일자를 받아야 우선변제권을 확보하여 소중한 보증금을 안전하게 보호받을 수 있습니다.
        </p>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/20">
          <button
            onClick={() => onSelectGuide('housing-lease-protection')}
            className="flex items-center gap-1.5 text-xs font-bold text-white hover:underline"
          >
            <span>{t('details', '상세보기')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* App Footer with Developer Jeong Yongju Credit */}
      <footer className="pt-3 pb-6 text-center space-y-1 border-t border-[#E8E2D6]/70 mt-6">
        <p className="text-xs font-bold text-[#253342]">한국생활 보석상자 (Korea Life Guide)</p>
        <p className="text-[11px] text-stone-600">
          기획 및 개발자: <strong className="text-[#3D836E] font-bold">정용주</strong>
        </p>
        <p className="text-[10px] text-stone-400">
          외국인 주민과 초기 정착민을 위한 무료 모바일 오프라인 정착 & 언어 가이드
        </p>
      </footer>
    </div>
  );
};
