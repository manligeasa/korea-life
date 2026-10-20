import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Bookmark,
  CheckCircle2,
  FileText,
  Phone,
  X,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { CATEGORIES, GUIDES } from '../../data/initialData';
import { CategoryId, Language } from '../../types';
import {
  getCategoryTitle,
  getGuideTitle,
  getGuideSummary,
  getGuideContent,
  getGuideKeyTips,
} from '../../utils/localization';

interface GuidesScreenProps {
  language: Language;
  selectedCategoryId: CategoryId | 'all';
  onSelectCategory: (categoryId: CategoryId | 'all') => void;
  activeGuideId: string | null;
  onOpenGuide: (guideId: string) => void;
  onCloseGuide: () => void;
  savedGuideIds: string[];
  onToggleBookmark: (guideId: string) => void;
}

export const GuidesScreen: React.FC<GuidesScreenProps> = ({
  language,
  selectedCategoryId,
  onSelectCategory,
  activeGuideId,
  onOpenGuide,
  onCloseGuide,
  savedGuideIds,
  onToggleBookmark,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const activeGuide = GUIDES.find((g) => g.id === activeGuideId);

  // Filter guides
  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory =
      selectedCategoryId === 'all' || guide.categoryId === selectedCategoryId;
    const title = getGuideTitle(guide, language).toLowerCase();
    const summary = getGuideSummary(guide, language).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      title.includes(q) ||
      summary.includes(q) ||
      guide.titleKo.toLowerCase().includes(q) ||
      guide.titleEn.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Category Tabs (Single-line interactive segmented controls with Dancheong styling) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
            selectedCategoryId === 'all'
              ? 'bg-[#253342] text-white shadow-xs'
              : 'bg-white/90 text-stone-700 border border-[#E8E2D6] hover:bg-[#EEF6F3]'
          }`}
        >
          {t('stageAll', '전체')}
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          const label = getCategoryTitle(cat, language);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#3D836E] text-white shadow-xs'
                  : 'bg-white/90 text-stone-700 border border-[#E8E2D6] hover:bg-[#EEF6F3]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder', '가이드 주제 및 키워드 검색...')}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 border border-[#E8E2D6] text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#3D836E] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
          >
            {t('cancel', '지우기')}
          </button>
        )}
      </div>

      {/* Guides List */}
      <div className="space-y-3">
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12 bg-white/90 rounded-2xl border border-[#E8E2D6]">
            <p className="text-sm font-medium text-stone-600">
              {t('noSearchResults', '일치하는 가이드가 없습니다.')}
            </p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isSaved = savedGuideIds.includes(guide.id);
            const category = CATEGORIES.find((c) => c.id === guide.categoryId);

            return (
              <div
                key={guide.id}
                className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs hover:border-[#3D836E] transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{category ? getCategoryTitle(category, language) : ''}</span>
                      {guide.isEssential && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#DF684E] font-semibold">
                            {t('essentialBadge', '필수 체크')}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(guide.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-[#DF684E] bg-[#FDF0EC]'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title={isSaved ? '북마크 해제' : '보석함에 저장'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>

                  <h3
                    onClick={() => onOpenGuide(guide.id)}
                    className="text-sm sm:text-base font-bold text-[#253342] group-hover:text-[#3D836E] transition-colors cursor-pointer leading-snug"
                  >
                    {getGuideTitle(guide, language)}
                  </h3>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {getGuideSummary(guide, language)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span>
                      {guide.contentKo.length} Core Tips
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenGuide(guide.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#3D836E] hover:underline"
                  >
                    <span>{t('details', '상세보기')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Guide Detail Modal / Bottom Drawer */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#E8E2D6]">
            {/* Top Drag Handle on Mobile */}
            <div className="sm:hidden w-10 h-1 bg-stone-300 rounded-full mx-auto mb-3" />

            {/* Header controls */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
              <div>
                <span className="text-xs font-semibold text-[#3D836E]">
                  {CATEGORIES.find((c) => c.id === activeGuide.categoryId)
                    ? getCategoryTitle(
                        CATEGORIES.find((c) => c.id === activeGuide.categoryId)!,
                        language
                      )
                    : ''}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#253342] mt-0.5 leading-snug">
                  {getGuideTitle(activeGuide, language)}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onToggleBookmark(activeGuide.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    savedGuideIds.includes(activeGuide.id)
                      ? 'text-[#DF684E] bg-[#FDF0EC]'
                      : 'text-stone-400 hover:text-stone-600 bg-stone-100'
                  }`}
                  title="보석함 저장"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      savedGuideIds.includes(activeGuide.id)
                        ? 'fill-current'
                        : ''
                    }`}
                  />
                </button>
                <button
                  onClick={onCloseGuide}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 bg-stone-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4">
              {/* Summary box with copy */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] relative">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {getGuideSummary(activeGuide, language)}
                </p>
                <button
                  onClick={() =>
                    handleCopySummary(getGuideSummary(activeGuide, language))
                  }
                  className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#3D836E] hover:underline"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('copied', '복사 완료!')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('copySummary', '요약 내용 복사')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Detailed Content Points */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D836E]">
                  {t('detailsTitle', '핵심 상세 안내')}
                </h4>
                <div className="space-y-2">
                  {getGuideContent(activeGuide, language).map(
                    (paragraph, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3D836E] mt-2 shrink-0" />
                        <span>{paragraph}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Key Tips (Dancheong Noerok Celadon accent) */}
              {activeGuide.keyTipsKo && activeGuide.keyTipsKo.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#EEF6F3] border border-[#A3CEC2] space-y-2">
                  <div className="flex items-center gap-1.5 text-[#255849] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#3D836E]" />
                    <span>{t('keyTipsTitle', '실전 생활 주의사항 및 꿀팁')}</span>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {getGuideKeyTips(activeGuide, language).map((tip, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[#255849] leading-relaxed"
                      >
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Documents */}
              {activeGuide.requiredDocsKo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[#253342] font-bold text-xs">
                    <FileText className="w-4 h-4 text-[#DF684E]" />
                    <span>{t('docsListTitle', '신청 시 준비 서류 목록')}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(language === 'ko'
                      ? activeGuide.requiredDocsKo
                      : activeGuide.requiredDocsEn || activeGuide.requiredDocsKo
                    ).map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-[#FAF7F2] text-xs text-stone-700 flex items-center gap-2 border border-[#E8E2D6]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3D836E] shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotlines with Dancheong Indigo & Vermilion */}
              {activeGuide.hotlines && activeGuide.hotlines.length > 0 && (
                <div className="pt-2 flex items-center gap-3">
                  {activeGuide.hotlines.map((hotline, idx) => (
                    <a
                      key={idx}
                      href={`tel:${hotline.number}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#253342] text-white font-semibold text-xs shadow-xs hover:bg-[#1A242F] active:scale-98 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#E8F3F0]" />
                      <span>{hotline.label} ({hotline.number})</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] flex justify-end">
              <button
                onClick={onCloseGuide}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                {t('close', '닫기')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
