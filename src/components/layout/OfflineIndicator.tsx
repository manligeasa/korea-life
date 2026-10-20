import React from 'react';
import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-4 right-4 z-50 flex items-center justify-between rounded-xl bg-[#D49B28]/95 px-4 py-2.5 text-xs font-medium text-white shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 border border-[#F2D08E]/40">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 text-[#FCF6E8]" />
        <span>{t('offlineBanner', '오프라인 상태입니다. 모든 데이터는 기기에 안전하게 캐시되어 있습니다.')}</span>
      </div>
      <span className="text-[11px] opacity-90 whitespace-nowrap shrink-0">로컬 구동</span>
    </div>
  );
};
