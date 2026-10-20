import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  FilePlus,
  Trash2,
  Edit2,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { GUIDES } from '../../data/initialData';
import { Language, PersonalNote } from '../../types';
import { getGuideTitle, getGuideSummary } from '../../utils/localization';

interface SavedScreenProps {
  language: Language;
  savedGuideIds: string[];
  onOpenGuide: (guideId: string) => void;
  onRemoveBookmark: (guideId: string) => void;
  personalNotes: PersonalNote[];
  onAddNote: (note: Omit<PersonalNote, 'id' | 'updatedAt'>) => void;
  onDeleteNote: (id: string) => void;
  onNavigateToTab: (tab: 'guides') => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  language,
  savedGuideIds,
  onOpenGuide,
  onRemoveBookmark,
  personalNotes,
  onAddNote,
  onDeleteNote,
  onNavigateToTab,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('행정/등록');
  const [newContent, setNewContent] = useState('');

  const savedGuides = GUIDES.filter((g) => savedGuideIds.includes(g.id));

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddNote({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
    });

    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Tab Switcher: Bookmarked Guides vs Personal Notes */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EAE4D8]/80 rounded-2xl border border-[#E8E2D6]">
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'bookmarks'
              ? 'bg-white text-[#3D836E] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t('savedGuides', '저장한 가이드')} ({savedGuides.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'notes'
              ? 'bg-white text-[#DF684E] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t('myNotes', '나의 정착 메모')} ({personalNotes.length})
        </button>
      </div>

      {/* 1. BOOKMARKS TAB */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3 animate-in fade-in">
          {savedGuides.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/90 rounded-2xl border border-[#E8E2D6] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF6F3] text-[#3D836E] border border-[#A3CEC2] flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#253342]">
                  {t('noSavedGuides', '아직 저장된 가이드가 없습니다')}
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  {t('noSavedGuidesDesc', '생활 가이드에서 북마크 아이콘을 터치하면 오프라인 상태에서도 언제든 다시 볼 수 있도록 보관됩니다.')}
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('guides')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D836E] text-white font-semibold text-xs shadow-xs hover:bg-[#255849] transition-colors"
              >
                <span>{t('exploreGuides', '가이드 둘러보기')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs flex items-start justify-between gap-3 group"
                >
                  <div
                    onClick={() => onOpenGuide(guide.id)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="text-[10px] font-semibold text-[#3D836E] uppercase tracking-wider">
                      {t('savedGuides', '저장된 가이드')}
                    </span>
                    <h4 className="text-sm font-bold text-[#253342] group-hover:text-[#3D836E] transition-colors leading-snug mt-0.5">
                      {getGuideTitle(guide, language)}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {getGuideSummary(guide, language)}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(guide.id)}
                    className="p-2 text-[#DF684E] hover:text-[#BA462E] hover:bg-[#FDF0EC] rounded-xl transition-colors shrink-0"
                    title="북마크 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. PERSONAL NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Lock className="w-3.5 h-3.5 text-[#3D836E]" />
              <span className="text-[11px]">{t('noteSecureInfo', '기기(LocalStorage)에만 안전하게 저장됩니다.')}</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#DF684E] hover:bg-[#BA462E] text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>{t('addNote', '새 메모 작성')}</span>
            </button>
          </div>

          {personalNotes.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/90 rounded-2xl border border-[#E8E2D6] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-stone-400 border border-[#E8E2D6] flex items-center justify-center mx-auto">
                <Edit2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#253342]">
                  {t('noNotes', '작성된 메모가 없습니다')}
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  {t('noNotesDesc', '외국인등록 예약번호, 집주인 계좌번호 등 중요한 정보를 적어두세요.')}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DF684E] text-white font-semibold text-xs shadow-xs hover:bg-[#BA462E] transition-colors"
              >
                <span>{t('firstNote', '첫 메모 작성하기')}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {personalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-[#DF684E] bg-[#FDF0EC] border border-[#F6BCB0] px-1.5 py-0.5 rounded-md">
                        {note.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#253342] mt-1 leading-snug">
                        {note.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-stone-400 hover:text-[#DF684E] rounded-lg transition-colors"
                      title="메모 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E2D6] font-mono text-[11px]">
                    {note.content}
                  </p>

                  <div className="text-[10px] text-stone-400 text-right">
                    수정: {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#E8E2D6] space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-[#253342]">
              {t('addNote', '새 메모 작성')}
            </h3>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('noteCategory', '카테고리 분류')}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs text-stone-900"
                >
                  <option value="비자/출입국">비자 / 출입국 (ARC, HiKorea)</option>
                  <option value="부동산/주거">부동산 / 주거 (집주인, 계약)</option>
                  <option value="금융/은행">금융 / 은행 (계좌, 송금)</option>
                  <option value="의료/병원">의료 / 병원 (진료, 보험)</option>
                  <option value="기타 생활">기타 생활 메모</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('noteTitle', '제목')}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t('notePlaceholderTitle', '제목 (예: 집주인 연락처, 예약번호)')}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('noteContent', '메모 내용')}
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={t('notePlaceholderContent', '중요한 생활 정보나 번호를 메모하세요.')}
                  rows={4}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] text-xs text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  {t('cancel', '취소')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#DF684E] hover:bg-[#BA462E] text-white shadow-xs"
                >
                  {t('saveNote', '메모 저장')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
