import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Terminal,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const ExpoStructureModal: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'app_json' | 'layout' | 'tabs_layout' | 'package'>('app_json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appJsonCode = `{
  "expo": {
    "name": "한국생활 보석상자",
    "slug": "korea-life-guide",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.korealife.guide"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f172a"
      },
      "package": "com.korealife.guide"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "korealifeguide"
  }
}`;

  const layoutCode = `// app/_layout.tsx (Expo Router Root Stack)
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="guide/[id]"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: '가이드 상세',
            headerTintColor: '#4f46e5',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}`;

  const tabsLayoutCode = `// app/(tabs)/_layout.tsx (Bottom Tab Navigator)
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: '생활가이드',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: '스마트도구',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: '내 보석함',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}`;

  const packageJsonCode = `{
  "name": "korea-life-guide-native",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "@react-native-async-storage/async-storage": "1.23.1",
    "lucide-react-native": "^0.470.0"
  }
}`;

  const terminalCommand = `# React Native / Expo 네이티브 앱 생성 및 즉시 실행:
npx create-expo-app@latest korea-life-guide --template tabs
cd korea-life-guide
npx expo install @react-native-async-storage/async-storage
npx expo start`;

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-white/95 border border-[#E8E2D6] shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#3D836E]" />
          <h3 className="text-sm sm:text-base font-bold text-[#253342]">
            React Native & Expo 모바일 프로젝트 구조
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-[#255849] bg-[#EEF6F3] border border-[#A3CEC2] px-2 py-0.5 rounded-md">
          네이티브 100% 호환 구조
        </span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        본 앱은 웹 브라우저 및 PWA뿐만 아니라, <strong>Expo Router 기반 React Native</strong> 모바일 네이티브 앱(Android APK/iOS IPA)으로 즉시 포팅할 수 있는 모듈형 아키텍처로 설계되었습니다.
      </p>

      {/* Recommended File Tree */}
      <div className="p-3.5 rounded-xl bg-[#253342] text-[#E8F3F0] font-mono text-xs overflow-x-auto">
        <div className="flex items-center justify-between text-[#A3CEC2] pb-2 mb-2 border-b border-white/10">
          <span className="flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-[#529B85]" />
            <span>Expo 모바일 프로젝트 디렉터리 구성</span>
          </span>
          <span className="text-[10px]">Expo Router v4</span>
        </div>
        <pre className="text-[11px] leading-relaxed text-[#A3CEC2]">
{`korea-life-guide/
├── app.json                  # Expo 앱 메타데이터 및 네이티브 빌드 설정
├── package.json              # React Native & Expo 모듈 의존성
├── app/                      # Expo Router 파일 기반 라우팅
│   ├── _layout.tsx           # 최상위 Stack & SafeAreaProvider 네비게이션
│   ├── (tabs)/               # 모바일 하단 탭 바 (4개 메인 탭)
│   │   ├── _layout.tsx       # 하단 탭 바 설정 (Home, Guides, Tools, Saved)
│   │   ├── index.tsx         # 홈 화면 (긴급전화, 오늘의 팁, 비자 위젯)
│   │   ├── guides.tsx        # 생활 가이드 목록 & 검색
│   │   ├── tools.tsx         # 쓰레기 분리배출 / 비자 계산기 / 주휴수당
│   │   └── saved.tsx         # 북마크 & 로컬 정착 메모 (AsyncStorage)
│   └── guide/[id].tsx        # 가이드 상세 모달 화면
├── src/
│   ├── data/                 # 100% 오프라인 생활 데이터셋
│   ├── types/                # TypeScript 인터페이스
│   └── hooks/                # useAsyncStorage (오프라인 캐싱)`}
        </pre>
      </div>

      {/* Code Snippets Viewer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#253342]">
            핵심 설정 파일 코드 미리보기
          </span>
          <button
            onClick={() => {
              const code =
                activeCodeTab === 'app_json'
                  ? appJsonCode
                  : activeCodeTab === 'layout'
                  ? layoutCode
                  : activeCodeTab === 'tabs_layout'
                  ? tabsLayoutCode
                  : packageJsonCode;
              handleCopy(activeCodeTab, code);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#3D836E] hover:underline"
          >
            {copiedKey === activeCodeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3D836E]" />
                <span>복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>코드 복사</span>
              </>
            )}
          </button>
        </div>

        {/* Code tabs */}
        <div className="flex items-center gap-1 border-b border-[#E8E2D6] pb-1">
          {[
            { id: 'app_json', label: 'app.json' },
            { id: 'layout', label: 'app/_layout.tsx' },
            { id: 'tabs_layout', label: 'app/(tabs)/_layout.tsx' },
            { id: 'package', label: 'package.json' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCodeTab(tab.id as any)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                activeCodeTab === tab.id
                  ? 'bg-[#253342] text-white font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-[#1E252D] text-[#E8F3F0] font-mono text-[11px] max-h-56 overflow-y-auto leading-relaxed border border-white/5">
          <pre>
            {activeCodeTab === 'app_json'
              ? appJsonCode
              : activeCodeTab === 'layout'
              ? layoutCode
              : activeCodeTab === 'tabs_layout'
              ? tabsLayoutCode
              : packageJsonCode}
          </pre>
        </div>
      </div>

      {/* Terminal Setup Command */}
      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#253342]">
            <Terminal className="w-3.5 h-3.5 text-[#3D836E]" />
            <span>터미널 1초 구동 명령어</span>
          </span>
          <button
            onClick={() => handleCopy('terminal', terminalCommand)}
            className="text-[11px] font-semibold text-[#3D836E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'terminal' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3D836E]" />
                <span>복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>명령어 복사</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
          {terminalCommand}
        </pre>
      </div>
    </div>
  );
};
