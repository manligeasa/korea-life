import React from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Monitor, Globe, Download, Sparkles, GraduationCap, Mic, Share2 } from 'lucide-react';
import { Language, KoreanLearningLevel } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../i18n';
import { getLevelMeta } from '../../data/learningQuizzes';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface TopAppBarProps {
  language: Language;
  learningLevel?: KoreanLearningLevel;
  onOpenLanguageModal: () => void;
  onOpenLevelModal?: () => void;
  onOpenRoleplay?: () => void;
  onOpenShare?: () => void;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  language,
  learningLevel = 'beginner',
  onOpenLanguageModal,
  onOpenLevelModal,
  onOpenRoleplay,
  onOpenShare,
  isSimulatorMode,
  onToggleSimulator,
}) => {
  const { t } = useTranslation();
  const { isInstallable, install } = usePWAInstall();

  const currentMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LANGUAGES[0];

  const currentLevelMeta = getLevelMeta(learningLevel);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2.5 px-3 sm:px-4 py-2.5 border-b border-[#E8E2D6] bg-[#FAF7F2]/95 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark with Dancheong jewel emblem */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#3D836E] to-[#255849] text-white shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FDF0EC]" />
        </div>
        <span className="text-xs sm:text-sm font-bold tracking-tight text-[#253342] whitespace-nowrap">
          {t('welcomeTitle', '한국생활 보석상자')}
        </span>
      </div>

      {/* Zone 2: Level trigger, Language switcher button & Simulator toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Learning Level Pill Trigger */}
        {onOpenLevelModal && (
          <button
            onClick={onOpenLevelModal}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-2xs active:scale-95"
            style={{
              backgroundColor: currentLevelMeta.dancheongColor.soft,
              color: currentLevelMeta.dancheongColor.text,
              borderColor: currentLevelMeta.dancheongColor.border,
            }}
            title="한국어 학습 수준 변경 / Change Learning Level"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-extrabold whitespace-nowrap">{currentLevelMeta.nameKo}</span>
          </button>
        )}

        {/* Free Native STT Voice Roleplay Trigger */}
        {onOpenRoleplay && (
          <button
            onClick={onOpenRoleplay}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#DF684E] bg-[#FDF0EC] hover:bg-[#FBE4DD] rounded-lg border border-[#F6BCB0] transition-colors cursor-pointer shadow-2xs active:scale-95"
            title="한국의 관혼상제 & 생활 대화 음성 역할극 (무료 기기 내장 STT)"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="text-[11px] font-extrabold hidden xs:inline">음성역할극</span>
          </button>
        )}

        {/* App Share & Deployment Guide Trigger */}
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#3D836E] bg-[#EEF6F3] hover:bg-[#DDF0E9] rounded-lg border border-[#A3CEC2] transition-colors cursor-pointer shadow-2xs"
            title="앱 공유 및 배포 안내 (주소 열리지 않을 때 해결)"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold hidden sm:inline">공유</span>
          </button>
        )}

        {/* Quick Language Pill Trigger */}
        <button
          onClick={onOpenLanguageModal}
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-[#253342] bg-white/90 hover:bg-[#EEF6F3] rounded-lg border border-[#E8E2D6] hover:border-[#3D836E] transition-colors cursor-pointer shadow-2xs"
          title="언어 변경 / Change Language"
        >
          <span className="text-xs">{currentMeta.flag}</span>
          <span className="text-[11px] truncate max-w-[55px] sm:max-w-none">{currentMeta.name}</span>
          <Globe className="w-3 h-3 text-[#3D836E] hidden xs:inline" />
        </button>

        {/* Device Frame View Toggle (Simulator vs Responsive Web) */}
        <button
          onClick={onToggleSimulator}
          title={isSimulatorMode ? '풀스크린 모드로 전환' : '스마트폰 시뮬레이터로 전환'}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-700 bg-white/90 hover:bg-stone-100 rounded-lg border border-[#E8E2D6] transition-colors whitespace-nowrap shrink-0 shadow-2xs"
        >
          {isSimulatorMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#3D836E]" />
              <span className="hidden md:inline text-[11px]">풀스크린</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#3D836E]" />
              <span className="hidden md:inline text-[11px]">스마트폰</span>
            </>
          )}
        </button>
      </div>

      {/* Zone 3: Primary action (PWA Install with Dancheong 주홍) */}
      <div className="flex items-center gap-2 shrink-0">
        {isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-[#DF684E] hover:bg-[#BA462E] rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3 h-3" />
            <span className="hidden xs:inline">설치</span>
          </button>
        )}
      </div>
    </header>
  );
};
