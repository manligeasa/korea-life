import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Sparkles, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../i18n';

interface LanguageSelectScreenProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onComplete: () => void;
  canCancel?: boolean;
  onCancel?: () => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onComplete,
  canCancel = false,
  onCancel,
}) => {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<Language>(currentLanguage);

  const handleLanguageClick = (lang: Language) => {
    setSelected(lang);
    onSelectLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleConfirm = () => {
    onSelectLanguage(selected);
    i18n.changeLanguage(selected);
    onComplete();
  };

  // Find currently selected meta
  const selectedMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === selected) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-full flex flex-col justify-between p-4 sm:p-6 bg-hanji-texture text-stone-800 select-none">
      {/* Top Header */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#3D836E] text-white shadow-xs">
              <Globe className="w-4 h-4 text-[#FDF0EC]" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#3D836E]">
              Multilingual Setup
            </span>
          </div>

          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-2 py-1 rounded-lg border border-[#E8E2D6] bg-white/80"
            >
              {t('close', '닫기')}
            </button>
          )}
        </div>

        {/* Dynamic Welcome Heading */}
        <div className="space-y-1">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#253342] flex items-center gap-2">
            <span>{selectedMeta.greeting}!</span>
            <Sparkles className="w-5 h-5 text-[#DF684E]" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#3D836E]">
            {t('welcomeTitle', '한국생활 보석상자')}
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed pt-1">
            {t(
              'selectLanguageDesc',
              '선택하신 언어로 모든 생활 가이드, 긴급 연락처, 스마트 도구가 제공됩니다. 앱 내 설정에서 언제든 다시 변경할 수 있습니다.'
            )}
          </p>
        </div>

        {/* 9 Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 max-h-[52vh] overflow-y-auto no-scrollbar pr-0.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageClick(lang.code)}
                className={`relative flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#3D836E] bg-[#EEF6F3] shadow-xs ring-1 ring-[#3D836E]'
                    : 'border-[#E8E2D6] bg-white/90 hover:border-[#A3CEC2] shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold truncate ${
                          isSelected
                            ? 'text-[#255849]'
                            : 'text-[#253342]'
                        }`}
                      >
                        {lang.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <span>{lang.nameKo}</span>
                      <span aria-hidden="true">·</span>
                      <span className="italic text-[#3D836E] font-medium">{lang.greeting}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#3D836E] text-white'
                      : 'border border-[#D5CCC0]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Footer with Dancheong 뇌록 Button */}
      <div className="pt-4 border-t border-[#E8E2D6] space-y-2.5">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3D836E]" />
          <span>100% 오프라인 로컬 번역 지원 (외부 데이터 소모 없음)</span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#3D836E] hover:bg-[#255849] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span>{t('startWithLanguage', '이 언어로 시작하기')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
