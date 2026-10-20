import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, Wrench, Bookmark, Settings2 } from 'lucide-react';
import { TabType } from '../../types';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  const { t } = useTranslation();

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t('tabHome', '홈'), icon: Home },
    { id: 'guides', label: t('tabGuides', '생활가이드'), icon: BookOpen },
    { id: 'tools', label: t('tabTools', '스마트도구'), icon: Wrench },
    { id: 'saved', label: t('tabSaved', '내 보석함'), icon: Bookmark },
    { id: 'settings', label: t('tabSettings', '설정·Expo'), icon: Settings2 },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-40 w-full border-t border-[#E8E2D6] bg-[#FAF7F2]/95 backdrop-blur-md px-2 pt-1 pb-1 safe-bottom transition-colors shadow-2xs"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto h-13">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[42px] py-1 px-2 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-[#3D836E] font-semibold'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4] text-[#3D836E]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {tab.id === 'saved' && savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#DF684E] text-[10px] font-bold text-white shadow-xs">
                    {savedCount > 9 ? '9+' : savedCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-6 h-0.5 rounded-full bg-[#3D836E]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Developer Credit Line */}
      <div className="pt-0.5 pb-0.5 text-center text-[10.5px] font-medium text-stone-500 flex items-center justify-center gap-1.5 select-none border-t border-[#E8E2D6]/50 mt-0.5">
        <span className="text-stone-400">한국생활 보석상자</span>
        <span className="text-stone-300">·</span>
        <span className="text-[#255849] font-bold">개발자: 정용주</span>
      </div>
    </nav>
  );
};
