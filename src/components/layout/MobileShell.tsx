import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileShellProps {
  children: React.ReactNode;
  isSimulatorMode: boolean;
  onToggleSimulator: () => void;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  isSimulatorMode,
  onToggleSimulator,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isSimulatorMode) {
    // Fullscreen responsive touch container with Hanji paper texture background
    return (
      <div className="min-h-screen bg-hanji-texture text-slate-800 flex flex-col items-center">
        <div className="w-full max-w-2xl min-h-screen flex flex-col bg-white/95 backdrop-blur-xs shadow-sm border-x border-[#E8E2D6] relative">
          {children}
        </div>
      </div>
    );
  }

  // Realistic Mobile Device Simulator Frame (iPhone 16 Pro styling with Hanji and Dancheong motif)
  return (
    <div className="min-h-screen bg-stone-200/80 p-2 sm:p-6 flex flex-col items-center justify-center transition-colors">
      {/* Device Frame */}
      <div className="relative w-full max-w-[430px] h-[92vh] max-h-[890px] bg-[#1E252D] rounded-[48px] p-3 shadow-2xl ring-1 ring-white/10 shadow-stone-900/30 flex flex-col overflow-hidden">
        {/* Dynamic Island Notch & Native Status Bar */}
        <div className="relative z-40 h-10 px-6 flex items-center justify-between text-stone-700 text-[12px] font-semibold tracking-tight select-none shrink-0 bg-[#FAF7F2]/95 backdrop-blur-md rounded-t-[36px] pt-1 border-b border-[#E8E2D6]/70">
          <span>{currentTime}</span>

          {/* Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            <span className="w-2 h-2 rounded-full bg-[#3D836E]/80 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 text-stone-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Device Internal Screen (Scrollable with authentic Hanji texture) */}
        <div className="relative flex-1 w-full overflow-y-auto overflow-x-hidden bg-hanji-texture rounded-b-[36px] flex flex-col">
          {children}

          {/* iOS Bottom Home Indicator Bar */}
          <div className="sticky bottom-0 left-0 right-0 h-4 bg-transparent flex items-center justify-center pointer-events-none z-50">
            <div className="w-32 h-1 bg-stone-400/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
