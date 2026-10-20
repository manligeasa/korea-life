import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  Globe,
  Rocket,
  ShieldCheck,
  X,
  Smartphone,
  Info,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'deploy'>('share');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '한국생활 보석상자 (Korea Life Guide)',
          text: '외국인과 정착민을 위한 무료 한국생활 필수 가이드 & 오프라인 PWA 앱',
          url: currentUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#FAF7F2] p-5 shadow-2xl border border-[#E8E2D6] space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3D836E] text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#253342]">
                앱 공유 및 링크 접속 안내
              </h3>
              <p className="text-[11px] text-stone-500">
                한국생활 보석상자 (개발자: 정용주)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#EDE8DF] rounded-xl text-xs font-bold text-stone-600">
          <button
            onClick={() => setActiveTab('share')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'share'
                ? 'bg-white text-[#253342] shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            링크 공유 및 접속 문제 해결
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'deploy'
                ? 'bg-white text-[#253342] shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            1분 무료 웹 배포 (출판)
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {activeTab === 'share' ? (
            <>
              {/* Why link doesn't open alert */}
              <div className="p-3.5 rounded-2xl bg-[#FFF6E5] border border-[#F2D08E] space-y-2">
                <div className="flex items-center gap-2 text-[#9A6700] font-bold text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>공유받은 사람의 화면에서 왜 주소가 안 열릴까요?</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  현재 AI Studio 개발 화면의 URL(예: <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono">*.run.app</code> 등)은 <strong>개발자 본인의 Google 계정 전용 보안 세션</strong>으로 보호되어 있습니다.
                </p>
                <p className="text-[11.5px] text-stone-600 leading-relaxed">
                  따라서 로그인 권한이 없는 다른 사람이나 일반 스마트폰에서 이 주소를 직접 열면 <strong>403 권한 오류</strong>나 <strong>빈 화면</strong>이 나타나게 됩니다.
                </p>
              </div>

              {/* Solution 1 & 2 */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#253342] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3D836E]" />
                  <span>해결 방법 2가지</span>
                </h4>

                {/* Solution 1 */}
                <div className="p-3 rounded-xl bg-white border border-[#E8E2D6] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3D836E]">
                      방법 1. AI Studio 우측 상단 [Share] 설정 변경
                    </span>
                    <span className="text-[10px] bg-[#EEF6F3] text-[#3D836E] px-1.5 py-0.5 rounded font-bold">
                      가장 쉬움
                    </span>
                  </div>
                  <ol className="text-xs text-stone-600 list-decimal pl-4 space-y-1 leading-relaxed">
                    <li>AI Studio 화면 오른쪽 상단의 <strong>[Share (공유)]</strong> 버튼을 클릭합니다.</li>
                    <li>공유 설정을 <strong>'Anyone with the link (링크가 있는 모든 사용자)'</strong>로 변경합니다.</li>
                    <li>그 후 <strong>[Copy link]</strong>로 복사한 주소를 보내주면 상대방도 바로 접속할 수 있습니다.</li>
                  </ol>
                </div>

                {/* Solution 2 */}
                <div className="p-3 rounded-xl bg-white border border-[#E8E2D6] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#DF684E]">
                      방법 2. Vercel / Cloudflare로 무료 배포 (영구 주소)
                    </span>
                    <span className="text-[10px] bg-[#FDF0EC] text-[#DF684E] px-1.5 py-0.5 rounded font-bold">
                      완전한 앱 출판 (추천)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    누구나 언제 어디서나 접속할 수 있는 전용 주소(예: <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px]">korea-life-guide.vercel.app</code>)를 1분 만에 만들 수 있습니다. 상단의 <strong>[1분 무료 웹 배포]</strong> 탭을 확인해 보세요.
                  </p>
                </div>
              </div>

              {/* Current URL Copy Box */}
              <div className="p-3 rounded-xl bg-white border border-[#E8E2D6] space-y-2">
                <div className="text-[11px] font-semibold text-stone-600">
                  현재 개발 화면 주소
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 font-mono truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3D836E] hover:bg-[#255849] text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>

                {'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full mt-1 py-2 rounded-xl bg-[#253342] hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>스마트폰 공유 창 열기 (카카오톡, 메시지 등)</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Deploy Guide Tab */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#255849] via-[#3D836E] to-[#253342] text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-[#F2D08E]" />
                  <h4 className="text-sm font-bold">1분 만에 전 세계 무료 출판하기</h4>
                </div>
                <p className="text-xs text-[#E8F3F0] leading-relaxed">
                  이 앱은 빌드 설정(<code className="bg-white/20 px-1 py-0.5 rounded text-[11px]">npm run build</code>)과 PWA 세팅이 이미 100% 완료되어 있어, <strong>Vercel</strong> 또는 <strong>Cloudflare Pages</strong>에 올리면 1분 만에 고유 도메인이 발급됩니다!
                </p>
              </div>

              {/* Step by Step */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white border border-[#E8E2D6] space-y-1.5">
                  <div className="text-xs font-bold text-[#253342] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#3D836E] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>GitHub 저장소 만들기</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-5">
                    GitHub(github.com)에서 새로운 Repository(예: <code className="bg-stone-100 px-1 py-0.5 rounded text-[11px]">korea-life-guide</code>)를 생성하고 현재 코드를 push합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8E2D6] space-y-1.5">
                  <div className="text-xs font-bold text-[#253342] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#3D836E] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Vercel.com에서 1-클릭 가져오기</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-5">
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3D836E] underline font-semibold inline-flex items-center gap-0.5"
                    >
                      Vercel.com <ExternalLink className="w-3 h-3" />
                    </a>
                    에 로그인 후 <strong>[Add New...] → [Project]</strong>를 누르고 방금 만든 GitHub 저장소를 선택합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8E2D6] space-y-1.5">
                  <div className="text-xs font-bold text-[#253342] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#3D836E] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>[Deploy] 버튼 클릭 후 출판 완료!</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-5">
                    설정을 바꿀 필요 없이 <strong>[Deploy]</strong>를 누르면 1분 뒤 전 세계 누구나 접속할 수 있는 <code className="text-[#3D836E] font-bold">https://korea-life-guide.vercel.app</code> 링크가 생성됩니다.
                  </p>
                </div>
              </div>

              {/* PWA Advantage */}
              <div className="p-3 rounded-xl bg-[#EEF6F3] border border-[#A3CEC2] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#255849]">
                  <Globe className="w-4 h-4" />
                  <span>배포 후 PWA의 엄청난 장점</span>
                </div>
                <p className="text-[11.5px] text-stone-700 leading-relaxed">
                  생성된 배포 링크를 스마트폰으로 열고 <strong>"홈 화면에 추가"</strong>를 누르면 앱스토어 심사 없이도 실제 앱처럼 아이콘이 생기고 오프라인에서도 작동합니다!
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-[#E8E2D6]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white border border-[#E8E2D6] text-stone-700 hover:bg-[#EEF6F3] text-xs font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
