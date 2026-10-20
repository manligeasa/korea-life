import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Smartphone,
  Download,
  Database,
  RefreshCw,
  Check,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { Language, KoreanLearningLevel } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../i18n';
import { getLevelMeta } from '../../data/learningQuizzes';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { ExpoStructureModal } from '../expo/ExpoStructureModal';
import { GraduationCap, Share2 } from 'lucide-react';

interface SettingsScreenProps {
  language: Language;
  learningLevel?: KoreanLearningLevel;
  onLanguageChange: (lang: Language) => void;
  onOpenLanguageModal: () => void;
  onOpenLevelModal?: () => void;
  onOpenShare?: () => void;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
  onResetData: () => void;
  savedCount: number;
  notesCount: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  language,
  learningLevel = 'beginner',
  onLanguageChange,
  onOpenLanguageModal,
  onOpenLevelModal,
  onOpenShare,
  isSimulatorMode,
  onToggleSimulator,
  onResetData,
  savedCount,
  notesCount,
}) => {
  const currentLevelMeta = getLevelMeta(learningLevel);
  const { t } = useTranslation();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleConfirmReset = () => {
    onResetData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      savedGuideIds: window.localStorage.getItem('korea_life_saved_guides'),
      notes: window.localStorage.getItem('korea_life_personal_notes'),
      checklists: window.localStorage.getItem('korea_life_checklists'),
      visa: window.localStorage.getItem('korea_life_visa_state'),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `korea-life-guide-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Language & Display Settings with Dancheong Accents */}
      <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-[#253342]">
          {t('settingsTitle', '앱 설정 & 네이티브 구조')}
        </h3>

        {/* Language selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#3D836E]" />
              <span>{t('languageSelect', '언어 선택 (Language)')}</span>
            </label>
            <button
              onClick={onOpenLanguageModal}
              className="text-[11px] font-semibold text-[#3D836E] hover:underline flex items-center gap-0.5"
            >
              <span>{t('changeLanguage', '언어 선택창 열기')}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`py-2 px-2.5 text-left rounded-xl border transition-all text-xs flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#3D836E] border-[#3D836E] text-white font-semibold shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E8E2D6] text-stone-700 hover:bg-[#EEF6F3]'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <div className="min-w-0">
                    <span className="truncate block font-medium">{lang.name}</span>
                    <span className="text-[10px] opacity-80 block truncate">{lang.nameKo}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Level Setting Section */}
        <div className="pt-3 border-t border-[#F0EBE1]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#3D836E]" />
              <span>한국어 학습 수준 (AsyncStorage 저장)</span>
            </label>
            {onOpenLevelModal && (
              <button
                onClick={onOpenLevelModal}
                className="text-[11px] font-semibold text-[#3D836E] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>수준 변경 및 테스트</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div
            onClick={onOpenLevelModal}
            className="p-3 rounded-xl border transition-all cursor-pointer hover:shadow-xs flex items-center justify-between gap-3"
            style={{
              backgroundColor: currentLevelMeta.dancheongColor.soft,
              borderColor: currentLevelMeta.dancheongColor.border,
            }}
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold"
                  style={{
                    backgroundColor: 'white',
                    color: currentLevelMeta.dancheongColor.text,
                  }}
                >
                  {currentLevelMeta.badge}
                </span>
                <span className="text-sm font-bold text-[#253342]">
                  {currentLevelMeta.nameKo} ({currentLevelMeta.nameEn})
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {currentLevelMeta.subtitleKo}
              </p>
              <p className="text-[11px] text-stone-500">
                문제 출제 난이도가 이 수준에 맞춰 자동으로 조절됩니다.
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </div>
        </div>

        {/* View mode toggle */}
        <div className="pt-3 border-t border-[#F0EBE1]">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[#3D836E]" />
            <span>{t('viewMode', '화면 보기 모드')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (!isSimulatorMode) onToggleSimulator();
              }}
              className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                isSimulatorMode
                  ? 'bg-[#253342] text-white border-transparent font-semibold shadow-xs'
                  : 'bg-[#FAF7F2] border-[#E8E2D6] text-stone-700'
              }`}
            >
              {t('mobileFrameMode', '스마트폰 프레임 모드')}
            </button>
            <button
              onClick={() => {
                if (isSimulatorMode) onToggleSimulator();
              }}
              className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                !isSimulatorMode
                  ? 'bg-[#253342] text-white border-transparent font-semibold shadow-xs'
                  : 'bg-[#FAF7F2] border-[#E8E2D6] text-stone-700'
              }`}
            >
              {t('fullscreenMode', '풀스크린 모바일 모드')}
            </button>
          </div>
        </div>
      </div>

      {/* 2. PWA In-App Install Prompt Card (Dancheong Noerok Gradient) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#255849] via-[#3D836E] to-[#253342] text-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#F2D08E]" />
            <h4 className="text-sm sm:text-base font-bold">
              {t('pwaInstallTitle', '홈 화면에 앱 추가하기')}
            </h4>
          </div>
          <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full text-[#E8F3F0]">
            PWA Standalone
          </span>
        </div>

        <p className="text-xs text-[#E8F3F0] leading-relaxed">
          {t('pwaInstallDesc', '스마트폰 홈 화면에 설치하면 앱스토어 다운로드 없이 전체화면으로 빠르게 구동되며 오프라인에서도 열람 가능합니다.')}
        </p>

        {isInstalled ? (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/15 text-xs text-emerald-200 font-medium">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{t('pwaInstalled', '이미 기기 홈 화면에 PWA 앱으로 설치되어 있습니다.')}</span>
          </div>
        ) : isInstallable ? (
          <button
            onClick={install}
            className="w-full py-2.5 rounded-xl bg-white text-[#255849] font-bold text-xs sm:text-sm shadow-md hover:bg-[#EEF6F3] active:scale-[0.98] transition-all"
          >
            {t('pwaInstallBtn', '앱 설치하기 (PWA)')}
          </button>
        ) : isIOS ? (
          <button
            onClick={() => setShowIOSModal(true)}
            className="w-full py-2.5 rounded-xl bg-white text-[#255849] font-bold text-xs sm:text-sm shadow-md hover:bg-[#EEF6F3] active:scale-[0.98] transition-all"
          >
            아이폰(iOS) 홈 화면에 추가하는 방법 보기
          </button>
        ) : (
          <div className="text-[11px] text-[#E8F3F0] bg-white/10 p-2.5 rounded-xl">
            브라우저 메뉴에서 "홈 화면에 추가"를 선택하여 설치할 수 있습니다.
          </div>
        )}
      </div>

      {/* 2-1. App Sharing & Web Deployment (Address Access Guide) Card */}
      <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#3D836E]" />
            <h4 className="text-xs sm:text-sm font-bold text-[#253342]">
              앱 공유 및 웹 출판 (배포 주소 접속 안내)
            </h4>
          </div>
          <span className="text-[10px] font-bold text-[#3D836E] bg-[#EEF6F3] px-2 py-0.5 rounded-full border border-[#A3CEC2]">
            배포 가이드
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          공유한 주소가 다른 사람이나 스마트폰에서 열리지 않는 원인과 해결법, 1분 만에 누구나 접속할 수 있는 무료 웹 주소(Vercel 등)로 출판하는 절차를 확인하세요.
        </p>

        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="w-full py-2.5 px-3 rounded-xl bg-[#EEF6F3] hover:bg-[#DDF0E9] text-[#255849] font-bold text-xs flex items-center justify-center gap-2 border border-[#A3CEC2] transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5 text-[#3D836E]" />
            <span>앱 주소 공유창 및 1분 무료 배포 가이드 열기</span>
          </button>
        )}
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#E8E2D6] space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-[#253342]">
              iPhone / iPad 홈 화면 추가 방법
            </h3>
            <ol className="text-xs text-stone-700 space-y-2 list-decimal pl-4 leading-relaxed">
              <li>
                Safari 브라우저 하단 툴바의 <strong>공유(Share)</strong> 아이콘을 탭합니다.
              </li>
              <li>
                목록을 아래로 스크롤하여 <strong>'홈 화면에 추가(Add to Home Screen)'</strong>를 선택합니다.
              </li>
              <li>
                우측 상단 <strong>'추가(Add)'</strong>를 누르면 바탕화면에 바로가기 앱 아이콘이 생성됩니다.
              </li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 text-xs font-semibold rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200"
            >
              {t('close', '닫기')}
            </button>
          </div>
        </div>
      )}

      {/* 3. Expo & React Native Project Structure Explorer */}
      <ExpoStructureModal />

      {/* 4. Local Data & Privacy */}
      <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#3D836E]" />
            <h4 className="text-xs sm:text-sm font-bold text-[#253342]">
              {t('dataBackupTitle', '로컬 데이터 및 무의존성 보안')}
            </h4>
          </div>
          <span className="text-[10px] text-stone-400">LocalStorage</span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          {t('dataBackupDesc', '오프라인 모드로 안전하게 작동 중입니다. 북마크와 개인 메모, 체크리스트 진행 내역은 외부 서버로 일절 전송되지 않습니다.')}
        </p>

        <div className="flex items-center gap-2 pt-2 border-t border-[#F0EBE1]">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EEF6F3] text-stone-700 text-xs font-semibold border border-[#E8E2D6] transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[#3D836E]" />
            <span>{t('backupBtn', '데이터 백업 (JSON)')}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#FDF0EC] hover:bg-[#FBE4DD] text-[#C4472D] border border-[#F6BCB0] text-xs font-semibold transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('resetBtn', '초기화')}</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="text-[11px] text-[#3D836E] font-semibold text-center animate-in fade-in">
            {t('resetSuccess', '로컬 데이터가 초기 상태로 재설정되었습니다.')}
          </div>
        )}
      </div>

      {/* 5. App & Developer Info Card */}
      <div className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF6F3] text-[#3D836E] text-xs font-bold border border-[#A3CEC2]">
          <span>한국생활 보석상자 v1.0</span>
        </div>
        <p className="text-sm font-extrabold text-[#253342]">한국생활 보석상자 (Korea Life Guide)</p>
        <p className="text-xs text-stone-600">
          기획 및 개발자: <strong className="text-[#3D836E] font-bold">정용주</strong>
        </p>
        <p className="text-[11px] text-stone-400 leading-relaxed">
          외국인 주민과 초기 정착민을 위한 100% 무료 오프라인 한국생활 & 언어 가이드
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#E8E2D6] space-y-3">
            <h4 className="text-sm font-bold text-[#253342]">
              데이터 초기화 확인
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              저장된 북마크, 개인 메모, 체크리스트 진행 상태가 모두 초기화됩니다. 계속하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                {t('cancel', '취소')}
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 text-xs font-semibold bg-[#DF684E] text-white rounded-lg hover:bg-[#BA462E]"
              >
                {t('resetBtn', '초기화 실행')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
