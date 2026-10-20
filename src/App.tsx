/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryId, ChecklistItem, Language, PersonalNote, TabType, VisaTrackerState, KoreanLearningLevel } from './types';
import { SETTLEMENT_CHECKLISTS } from './data/initialData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS, saveStoredLearningLevel } from './utils/storage';
import { MobileShell } from './components/layout/MobileShell';
import { TopAppBar } from './components/layout/TopAppBar';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { HomeScreen } from './components/screens/HomeScreen';
import { GuidesScreen } from './components/screens/GuidesScreen';
import { ToolsScreen } from './components/screens/ToolsScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LanguageSelectScreen } from './components/screens/LanguageSelectScreen';
import { LevelSelectScreen } from './components/screens/LevelSelectScreen';
import { RoleplayModal } from './components/roleplay/RoleplayModal';
import { ShareModal } from './components/share/ShareModal';

export default function App() {
  const { i18n } = useTranslation();

  // Language state (defaults to 'ko')
  const [language, setLanguage] = useLocalStorage<Language>('korea_life_language', 'ko');

  // Track if user has completed initial language selection
  const [hasSelectedLang, setHasSelectedLang] = useLocalStorage<boolean>(
    'korea_life_has_selected_lang',
    false
  );

  // Modal state to change language anytime
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  // Korean Learning Level state (AsyncStorage backed)
  const [learningLevel, setLearningLevel] = useLocalStorage<KoreanLearningLevel>(
    STORAGE_KEYS.LEARNING_LEVEL,
    'beginner'
  );
  const [showLevelModal, setShowLevelModal] = useState<boolean>(false);

  // Free Native STT Voice Roleplay Modal State
  const [showRoleplayModal, setShowRoleplayModal] = useState<boolean>(false);
  const [activeRoleplayScenarioId, setActiveRoleplayScenarioId] = useState<string>('rites-funeral');

  const handleOpenRoleplay = (scenarioId?: string) => {
    if (scenarioId) {
      setActiveRoleplayScenarioId(scenarioId);
    }
    setShowRoleplayModal(true);
  };

  // Share & Web Deployment Guide Modal State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Sync i18n instance when language state changes
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSimulatorMode, setIsSimulatorMode] = useLocalStorage<boolean>('korea_life_simulator_mode', true);

  // Bookmarks state (initial sample)
  const [savedGuideIds, setSavedGuideIds] = useLocalStorage<string[]>(
    'korea_life_saved_guides',
    ['arc-registration', 'waste-sorting-master']
  );

  // Settlement Checklists state
  const [checklists, setChecklists] = useLocalStorage<ChecklistItem[]>(
    'korea_life_checklists',
    SETTLEMENT_CHECKLISTS
  );

  // Personal Notes state
  const [personalNotes, setPersonalNotes] = useLocalStorage<PersonalNote[]>(
    'korea_life_personal_notes',
    [
      {
        id: 'note-sample-1',
        title: '하이코리아 출입국 예약 번호',
        category: '비자/출입국',
        content: '서울남부출입국·외국인관서 3층 창구 / 예약번호: HK-20261018-042',
        updatedAt: new Date().toISOString(),
      },
    ]
  );

  // Visa Tracker state
  const [visaState, setVisaState] = useLocalStorage<VisaTrackerState>(
    'korea_life_visa_state',
    {
      visaType: 'D-2 (유학 / International Student)',
      expiryDate: '2026-12-31',
      reminderEnabled: true,
    }
  );

  // Guides screen state
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | 'all'>('all');
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  // Handlers
  const handleToggleBookmark = (guideId: string) => {
    setSavedGuideIds((prev) =>
      prev.includes(guideId)
        ? prev.filter((id) => id !== guideId)
        : [...prev, guideId]
    );
  };

  const handleToggleChecklist = (id: string) => {
    setChecklists((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddNote = (noteData: Omit<PersonalNote, 'id' | 'updatedAt'>) => {
    const newNote: PersonalNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    setPersonalNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setPersonalNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleResetData = () => {
    setSavedGuideIds(['arc-registration', 'waste-sorting-master']);
    setChecklists(SETTLEMENT_CHECKLISTS);
    setPersonalNotes([]);
    setVisaState({
      visaType: 'D-2 (유학 / International Student)',
      expiryDate: '',
      reminderEnabled: true,
    });
    setLearningLevel('beginner');
    saveStoredLearningLevel('beginner');
    setHasSelectedLang(false);
  };

  const handleLevelChosen = async (level: KoreanLearningLevel) => {
    setLearningLevel(level);
    await saveStoredLearningLevel(level);
  };

  const handleNavigateToCategory = (catId: CategoryId) => {
    setSelectedCategoryId(catId);
    setActiveTab('guides');
  };

  const handleSelectGuide = (guideId: string) => {
    setActiveGuideId(guideId);
    setActiveTab('guides');
  };

  const handleLanguageChosen = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleCompleteInitialLang = () => {
    setHasSelectedLang(true);
    setShowLanguageModal(false);
  };

  return (
    <MobileShell
      isSimulatorMode={isSimulatorMode}
      onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
    >
      {/* 1. App First Launch Onboarding Language Screen */}
      {!hasSelectedLang ? (
        <LanguageSelectScreen
          currentLanguage={language}
          onSelectLanguage={handleLanguageChosen}
          onComplete={handleCompleteInitialLang}
          canCancel={false}
        />
      ) : (
        <>
          {/* Offline Indicator Banner */}
          <OfflineIndicator />

          {/* Top App Bar adhering to 3-zone Top Bar Contract */}
          <TopAppBar
            language={language}
            learningLevel={learningLevel}
            onOpenLanguageModal={() => setShowLanguageModal(true)}
            onOpenLevelModal={() => setShowLevelModal(true)}
            onOpenRoleplay={() => handleOpenRoleplay('rites-funeral')}
            onOpenShare={() => setShowShareModal(true)}
            isSimulatorMode={isSimulatorMode}
            onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
          />

          {/* Main Content Area */}
          <main className="flex-1 px-4 pt-4 overflow-y-auto">
            {activeTab === 'home' && (
              <HomeScreen
                language={language}
                learningLevel={learningLevel}
                onNavigateToCategory={handleNavigateToCategory}
                onSelectGuide={handleSelectGuide}
                onNavigateToTab={setActiveTab}
                onOpenLevelModal={() => setShowLevelModal(true)}
                onOpenRoleplay={handleOpenRoleplay}
                visaState={visaState}
              />
            )}

            {activeTab === 'guides' && (
              <GuidesScreen
                language={language}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                activeGuideId={activeGuideId}
                onOpenGuide={setActiveGuideId}
                onCloseGuide={() => setActiveGuideId(null)}
                savedGuideIds={savedGuideIds}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {activeTab === 'tools' && (
              <ToolsScreen
                language={language}
                checklists={checklists}
                onToggleChecklist={handleToggleChecklist}
                visaState={visaState}
                onUpdateVisaState={setVisaState}
              />
            )}

            {activeTab === 'saved' && (
              <SavedScreen
                language={language}
                savedGuideIds={savedGuideIds}
                onOpenGuide={handleSelectGuide}
                onRemoveBookmark={handleToggleBookmark}
                personalNotes={personalNotes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsScreen
                language={language}
                learningLevel={learningLevel}
                onLanguageChange={handleLanguageChosen}
                onOpenLanguageModal={() => setShowLanguageModal(true)}
                onOpenLevelModal={() => setShowLevelModal(true)}
                onOpenShare={() => setShowShareModal(true)}
                isSimulatorMode={isSimulatorMode}
                onToggleSimulator={() => setIsSimulatorMode(!isSimulatorMode)}
                onResetData={handleResetData}
                savedCount={savedGuideIds.length}
                notesCount={personalNotes.length}
              />
            )}

            {activeTab === 'level' && (
              <LevelSelectScreen
                currentLevel={learningLevel}
                onSelectLevel={handleLevelChosen}
                canClose={false}
              />
            )}
          </main>

          {/* Mobile Ergonomic Bottom Tab Bar */}
          <BottomTabBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab !== 'guides') {
                setActiveGuideId(null);
              }
            }}
            savedCount={savedGuideIds.length + personalNotes.length}
          />

          {/* Language Selection Modal (when requested inside the app) */}
          {showLanguageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in">
              <div className="w-full max-w-lg max-h-[92vh] overflow-hidden rounded-3xl shadow-2xl border border-[#E8E2D6] flex flex-col">
                <LanguageSelectScreen
                  currentLanguage={language}
                  onSelectLanguage={handleLanguageChosen}
                  onComplete={() => setShowLanguageModal(false)}
                  canCancel={true}
                  onCancel={() => setShowLanguageModal(false)}
                />
              </div>
            </div>
          )}

          {/* Learning Level Selection & Quiz Modal */}
          {showLevelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in">
              <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#E8E2D6] bg-[#FAF7F2] p-4 flex flex-col no-scrollbar">
                <LevelSelectScreen
                  currentLevel={learningLevel}
                  onSelectLevel={handleLevelChosen}
                  canClose={true}
                  onClose={() => setShowLevelModal(false)}
                />
              </div>
            </div>
          )}

          {/* Free Native STT Voice Roleplay Simulator Modal */}
          {showRoleplayModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in">
              <div className="w-full max-w-xl h-[92vh] max-h-[840px] flex flex-col min-h-0">
                <RoleplayModal
                  language={language}
                  initialScenarioId={activeRoleplayScenarioId}
                  onClose={() => setShowRoleplayModal(false)}
                />
              </div>
            </div>
          )}

          {/* Share & Deployment Guide Modal */}
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
          />
        </>
      )}
    </MobileShell>
  );
}
